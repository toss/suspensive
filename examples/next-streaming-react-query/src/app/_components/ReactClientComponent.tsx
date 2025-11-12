'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { query } from '~/query'

export const ReactClientComponent = ({ queryKeyId }: { queryKeyId: number }) => {
  const { data } = useSuspenseQuery(query.text(queryKeyId))
  return (
    <ul className="bg-lime-500">
      <li>queryKey id: {data.id}</li>
      <li>Requested from :{data.requestFrom}</li>
      <li>Response at :{format(new Date(data.responseAt), 'yyyy-MM-dd HH:mm:sss.SSS')}</li>
    </ul>
  )
}
