import 'react'
import { TestText } from '@suspensive/react-native'
import { Text, View } from 'react-native'

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TestText />
      <Text>Suspensive</Text>
    </View>
  )
}
