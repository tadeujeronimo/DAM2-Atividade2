import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';
import convertMinutesToHour from '../utils/convertMinutesToHour';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface CoachClassRow {
  class_id: number;
  id: number;
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: string;
  schedule_id: number;
  week_day: number;
  from: number;
  to: number;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    if ((!filters.week_day) || (!filters.subject) || (!filters.time)) {
      return response.status(400).json({
        error: 'Missing filters to search classes'
      });
    }
  
    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function() {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('coaches', 'classes.coach_id', '=', 'coaches.id')
      // Junta todos os horários disponíveis da aula (não só o que casou com o filtro)
      .join('class_schedule', 'class_schedule.class_id', '=', 'classes.id')
      .select([
        'classes.id as class_id',
        'classes.subject',
        'classes.cost',
        'coaches.id',
        'coaches.name',
        'coaches.avatar',
        'coaches.whatsapp',
        'coaches.bio',
        'class_schedule.id as schedule_id',
        'class_schedule.week_day',
        'class_schedule.from',
        'class_schedule.to',
      ])
      .orderBy(['classes.id', 'class_schedule.week_day', 'class_schedule.from']) as CoachClassRow[];

    // O join devolve uma linha por horário; agrupa de volta em um item por coach
    const coachesMap = new Map<number, any>();

    classes.forEach(row => {
      if (!coachesMap.has(row.class_id)) {
        coachesMap.set(row.class_id, {
          id: row.id,
          class_id: row.class_id,
          name: row.name,
          avatar: row.avatar,
          whatsapp: row.whatsapp,
          bio: row.bio,
          subject: row.subject,
          cost: row.cost,
          schedule: [],
        });
      }

      coachesMap.get(row.class_id).schedule.push({
        id: row.schedule_id,
        week_day: row.week_day,
        from: convertMinutesToHour(row.from),
        to: convertMinutesToHour(row.to),
      });
    });

    return response.json(Array.from(coachesMap.values()));
  }
  
  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;
  
    const trx = await db.transaction();
  
    try {
      const insertedCoachesIds = await trx('coaches').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });
    
      const coach_id = insertedCoachesIds[0];
    
      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        coach_id,
      });
    
      const class_id = insertedClassesIds[0];
    
      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      });
    
      await trx('class_schedule').insert(classSchedule);
    
      await trx.commit();
    
      return response.status(201).send();
    } catch (err) {
      await trx.rollback();
  
      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      });
    }
  }
}