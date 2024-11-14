import { Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Providers } from '@/src/providers'
import 'react-native-reanimated'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="auto" />
      <Slot />
    </Providers>
  )
}
