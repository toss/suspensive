import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import { PropsWithChildren } from 'react'
import { useEffect } from 'react'

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
