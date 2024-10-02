export const queryKey = ['key'] as const
const sleep = (ms: number) => new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), ms))
export const queryFn = () => sleep(10).then(() => ({ text: 'response' }))
export const select = (data: Awaited<ReturnType<typeof queryFn>>) => data.text
