/* eslint-disable react-native/no-inline-styles */
import {Formik} from 'formik';
import React, {createRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import EIcon from 'react-native-vector-icons/AntDesign';
import KIcon from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../../Redux/AuthReducer';
import {useDispatch} from 'react-redux';
import styles from './styles';

const validationSchema = yup.object().shape({
  email: yup.string(),
  password: yup.string().required('Şifre gerekli'),
});

interface User {
  username: string;
  password: string;
}
/**
 * Login Screen component for user authentication.
 *
 * @param {object} props - Component properties.
 * @param {object} props.navigation - React Navigation prop for navigating between screens.
 * @param {function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} - Rendered component.
 */
const LoginScreen: React.FC<{navigation: any; onClose: () => void}> = ({
  navigation,
  onClose,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = createRef<TextInput>();
  const passwordRef = createRef<TextInput>();
  /**
   * Navigate to the registration screen.
   */
  const goRegister = async () => {
    navigation.navigate('Register');
  };
  /**
   * Handle form submission for user login.
   *
   * @param {object} form - User login form data.
   * @param {string} form.email - User's email or username.
   * @param {string} form.password - User's password.
   */
  const handleSubmit = async (form: User) => {
    try {
      // Retrieve stored user data from AsyncStorage...
      // Validate user credentials...
      // Handle login or display an error message...
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) {
        const users: User[] = JSON.parse(storedUsers);

        const user = users.find(
          u => u.username === form.email && u.password === form.password,
        );
        if (user) {
          setLoading(false);
          dispatch(login(user));
        } else {
          setLoading(false);
          Alert.alert('Hata', 'Kullanıcı adı veya şifre yanlış');
        }
      } else {
        setLoading(false);
        Alert.alert('Hata', 'Kayıtlı kullanıcı bulunamadı');
      }
    } catch (error) {
      setLoading(false);
      console.error('AsyncStorage Error:', error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleSubmit(values);
        }}>
        {({handleChange, handleSubmit, values, errors, touched}) => (
          <View style={styles.classContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../../assets/images/bip-bg.jpg')}
                resizeMode="cover"
              />
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.sectionStyle,
                  {
                    borderColor:
                      touched.email && errors.email ? '#FF0000' : 'transparent',
                    borderWidth: 1,
                  },
                ]}>
                <Icon
                  name="person-outline"
                  size={20}
                  color="#808080"
                  style={{
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginLeft: 20,
                  }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Kullanıcı adı"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('email')}
                  value={values.email}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={'grey'}
                  fontSize={15}
                  selectionColor={'blue'}
                  keyboardShouldPersistTaps="always"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  ref={emailRef}
                />
              </View>

              <View style={styles.errorValidation}>
                {touched.email && errors.email ? (
                  <Text style={{color: '#FF0000'}}>{errors.email}</Text>
                ) : null}
              </View>

              <View
                style={[
                  styles.sectionStyle,
                  {
                    borderColor:
                      touched.password && errors.password
                        ? '#FF0000'
                        : 'transparent',
                    borderWidth: 1,
                  },
                ]}>
                <KIcon
                  name="key"
                  size={19}
                  color={'#808080'}
                  style={{
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginLeft: 20,
                    justifyContent: 'flex-start',
                    transform: [{rotate: '137deg'}, {rotateX: '180deg'}],
                    marginRight: 3,
                  }}
                />
                <TextInput
                  style={styles.input}
                  secureTextEntry={passwordVisible}
                  placeholder="Şifre"
                  onChangeText={handleChange('password')}
                  value={values.password}
                  placeholderTextColor={'grey'}
                  fontSize={15}
                  selectionColor={'blue'}
                  underlineColorAndroid="transparent"
                  keyboardShouldPersistTaps="always"
                  ref={passwordRef}
                />
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={24}
                      color="#808080"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.errorValidation}>
                {touched.password && errors.password ? (
                  <Text style={{color: '#FF0000'}}>{errors.password}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.LoginButton}
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => {
                    handleSubmit();
                  }, 2000);
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.RegisterButton}
                onPress={goRegister}>
                <Text
                  style={{
                    color: '#05a6ef',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      {alertVisible && (
        <Modal
          transparent
          visible={alertVisible}
          animationType="fade"
          backdropTransparent={true}>
          <View style={styles.loadingContainer}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.alertMessage}>
                <EIcon name="exclamationcircle" size={40} color="blue" />
                <Text
                  style={{
                    color: '#000',
                    fontSize: 20,
                  }}>
                  {errorMessage !== ''
                    ? errorMessage
                    : 'Kullanıcı adı veya Şifre hatalı!'}
                </Text>

                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={() => {
                    setAlertVisible(false);
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Tamam
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal transparent visible={loading}>
        <View style={styles.loadingContainer}>
          <View style={styles.loading}>
            <ActivityIndicator size={30} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LoginScreen;
