import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  classContainer: {
    flex: 1,
    height: windowHeight,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  inputContainer: {
    width: windowHeight * 0.9,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 100,
  },

  input: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
    alignSelf: 'center',
    borderRadius: 18,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#000',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: windowWidth * 0.03,
  },

  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth,
    height: windowHeight,
    //backgroundColor:'red',
  },
  logo: {
    resizeMode: 'contain',
    //backgroundColor:'blue',
    flex: 1,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    height: 50,
    marginVertical: 7,
  },
  TextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomText: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  LoginButton: {
    marginTop: 7,
    backgroundColor: '#05a6ef',
    width: windowWidth * 0.9,
    height: windowHeight * 0.07,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  RegisterButton: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#05a6ef',
    backgroundColor: '#FFF',
    width: windowWidth * 0.9,
    height: windowHeight * 0.07,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: windowWidth * 0.1,
    height: windowHeight * 0.07,
    backgroundColor: 'transparent',
    right: windowWidth * 0.01,
  },
  spinnerTextStyle: {
    color: 'blue',
  },
  errorValidation: {
    width: windowWidth * 0.8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.15,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMessage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  alertButton: {
    width: windowWidth * 0.5,
    height: windowHeight * 0.065,
    backgroundColor: 'blue',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  none: {
    flex: 0,
    position: 'absolute',
    color: 'transparent',
    backgroundColor: 'transparent',
  },
});
export default styles;
