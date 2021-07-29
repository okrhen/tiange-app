import { useMutation } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { Box, Button, Center, HStack, Input, KeyboardAvoidingView, Text, VStack } from 'native-base'
import React, { useState } from 'react'
import { Keyboard } from 'react-native'
import { ILogin } from '../../interfaces/Login'
import Themes from '../../styles/Themes'
import { loginFormValidation } from '../../utils/validations/LoginSchema'
import { LOGIN } from './gql/Login.gql'

const initialLoginValues: ILogin = {
  email: '',
  password: ''
}

function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const navigation = useNavigation()

  const [login] = useMutation(LOGIN, {
    onError: (err) => {
      setIsLogin(false)
    },
    onCompleted: async ({ signInUser: { token } }) => {
      setIsLogin(false)
      console.log('token ==>', token)
      if (token) {
        // set user successful login
        await AsyncStorage.setItem('@token', token);
        navigation.replace('Dashboard')
      }
    }
  })

  const handleTouch = () => (
    Keyboard.dismiss()
  )
  return (
    <Center flex={1} onTouchStart={handleTouch}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40} w="45%" >
        <Box padding={10} bg="#fff" borderRadius={4}>
          <Formik
            initialValues={initialLoginValues}
            validationSchema={loginFormValidation}
            onSubmit={(values) => {
              setIsLogin(true)
              login({
                variables: {
                  email: values.email,
                  password: values.password
                }
              })
              return ''
            }}
          >
            {({ values, handleChange, handleBlur, handleSubmit, dirty, isValid }) => {
              return (
                <VStack space={5}>
                  <Text fontSize={24} textAlign="center">Beb's Tiange </Text>
                  <Input
                    size="xl"
                    placeholder="Username"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  <Input
                    size="xl"
                    placeholder="Password"
                    value={values.password}
                    secureTextEntry
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                  <Button
                    bg={Themes.main.primary}
                    disabled={!dirty || !isValid || isLogin}
                    onPress={handleSubmit}>
                    <Text color={Themes.common.white} fontWeight={600}>{isLogin ? 'Logging in...' : 'Login'}</Text>
                  </Button>
                </VStack>
              )

            }}
          </Formik>

        </Box>
      </KeyboardAvoidingView>
    </Center>
  )
}

export default Login