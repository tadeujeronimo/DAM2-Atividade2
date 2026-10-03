import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6f0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },

  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
  },

  profileInfo: {
    marginLeft: 16,
  },

  name: {
    fontFamily: 'Archivo_700Bold',
    color: '#32364d',
    fontSize: 20,
  },

  subject: {
    fontFamily: 'Poppins_400Regular',
    color: '#6a6180',
    fontSize: 12,
    marginTop: 4,
  },

  bio: {
    marginHorizontal: 24,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 24,
    color: '#6a6180',
  },

  schedule: {
    marginHorizontal: 24,
    marginTop: 24,
  },

  scheduleTitle: {
    fontFamily: 'Archivo_700Bold',
    color: '#32364d',
    fontSize: 14,
    marginBottom: 8,
  },

  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8fc',
    borderWidth: 1,
    borderColor: '#e6e6f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  scheduleDay: {
    fontFamily: 'Poppins_400Regular',
    color: '#6a6180',
    fontSize: 14,
  },

  scheduleTime: {
    fontFamily: 'Archivo_700Bold',
    color: '#8257e5',
    fontSize: 14,
  },

  scheduleEmpty: {
    fontFamily: 'Poppins_400Regular',
    color: '#c1bccc',
    fontSize: 14,
  },

  footer: {
    backgroundColor: '#fafafc',
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },

  price: {
    fontFamily: 'Poppins_400Regular',
    color: '#6a6180',
    fontSize: 14,
  },

  priceValue: {
    fontFamily: 'Archivo_700Bold',
    color: '#8257e5',
    fontSize: 16,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },

  favoriteButton: {
    backgroundColor: '#8257e5',
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  favorited: {
    backgroundColor: '#e33d3d',
  },

  contactButton: {
    backgroundColor: '#04d361',
    flex: 1,
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  contactButtonText: {
    color: '#fff',
    fontFamily: 'Archivo_700Bold',
    fontSize: 16,
    marginLeft: 16,
  },


});

export default styles;