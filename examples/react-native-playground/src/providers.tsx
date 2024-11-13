import { PropsWithChildren, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import {
  NotoSansKR_300Light,
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
  useFonts,
} from '@expo-google-fonts/noto-sans-kr'
import * as SplashScreen from 'expo-splash-screen'

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <FontProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </SafeAreaProvider>
    </FontProvider>
  )
}

const FontProvider = ({ children }: PropsWithChildren) => {
  const [loaded, error] = useFonts({
    NotoSansKR_300Light,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
  })

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }
  return children
}
