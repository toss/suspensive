import { Stack } from 'expo-router'
import { Fragment } from 'react'

export default function NotFoundScreen() {
  return (
    <Fragment>
      <Stack.Screen options={{ title: 'Oops!' }} />
    </Fragment>
  )
}
