import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import SplashScreen from './src/components/SplashScreen';
import AppNavigation from './src/navigation/AppNavigation';
import { extendTheme, NativeBaseProvider } from 'native-base';
import client, { getToken } from './src/apollo/config';
import { LogBox } from 'react-native';



export default function App() {
  const [token, setToken] = useState<string | null | undefined>(null)
  const [isAppReady, setIsAppReady] = useState<boolean>(false)

  useEffect(() => {
    getToken().then(item => {
      setToken(item)
    });

    setIsAppReady(true)
  }, [])


  const theme = extendTheme({
    components: {
      Button: {
        defaultProps: {
          colorScheme: 'emerald',
        },
        backgroundColor: {
          primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          }
        }
      },
    },
  });

  /**
   * 
   * Ignored Warnings
   */
  LogBox.ignoreAllLogs()


  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider theme={theme}>
        <>
          <StatusBar style="light" />
          {isAppReady && token != null ?
            <AppNavigation isLoggedIn={Boolean(token)} />
            : <SplashScreen />}
        </>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}