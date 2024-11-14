import * as SplashScreen from 'expo-splash-screen'
import { type PropsWithChildren, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <SplashScreenProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </SafeAreaProvider>
    </SplashScreenProvider>
  )
}

const SplashScreenProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])
  return children
}
