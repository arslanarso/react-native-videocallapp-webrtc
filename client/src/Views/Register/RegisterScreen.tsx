/**
 * RegisterScreen displays a registration form for users to sign up with their email and password.
 * @module Screens/RegisterScreen
 */

/* eslint-disable react-native/no-inline-styles */
import {Formik} from 'formik';
import React, {createRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import KIcon from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addUser} from '../../Redux/UserReducer';
import {useDispatch} from 'react-redux';
import styles from './styles';
/**
 * Represents the validation schema for the registration form.
 */
const validationSchema = yup.object().shape({
  email: yup.string(),
  password: yup.string().required('Şifre gerekli'),
});
/**
 * Represents the user registration data.
 */
interface User {
  email: string;
  password: string;
}
/**
 * RegisterScreen component for user registration.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.navigation - The navigation object for navigating between screens.
 * @param {Function} props.onClose - A function to close the registration screen.
 */
const RegisterScreen: React.FC<{navigation: any; onClose: () => void}> = ({
  navigation,
  onClose,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const emailRef = createRef<TextInput>();
  const passwordRef = createRef<TextInput>();
  /**
   * Generates a unique user ID for registration.
   * @returns {Promise<string>} - The unique user ID.
   */
  const generateUniqueUserId = async () => {
    let isUnique = false;
    let userId;

    while (!isUnique) {
      userId = Math.floor(Math.random() * 50) + 1;

      const existingUsers = await AsyncStorage.getItem('users');
      const users = JSON.parse(existingUsers || '[]');

      if (!users.some(user => user.id === userId)) {
        isUnique = true;
      }
    }

    return userId.toString();
  };
  /**
   * Handles the registration form submission.
   * @param {User} form - The user registration data.
   */
  const handleSubmit = async (form: User) => {
    const userId = await generateUniqueUserId();
    const username = form.email;
    const password = form.password;
    const userData = {id: userId, username, password};
    dispatch(addUser(userData));

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = JSON.parse(existingUsers || '[]');

      const userExists = users.some(user => user.username === username);

      if (userExists) {
        setLoading(false);

        Alert.alert('Kayıt Hatası', 'Bu kullanıcı adı zaten mevcut.');
      } else {
        users.push(userData);
        await AsyncStorage.setItem('users', JSON.stringify(users));

        setLoading(false);
        Alert.alert('Kayıt Tamamlandı', 'Kayıt işlemi başarıyla tamamlandı!', [
          {
            text: 'Giriş Yap',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.warn('AsyncStorage Error:', error);
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
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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

export default RegisterScreen;
