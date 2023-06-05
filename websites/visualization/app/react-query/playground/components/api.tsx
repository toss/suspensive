import axios from 'axios'

const delay = (ms = 1000) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
const delayRandom = (maxMs = 1000) => delay(maxMs * Math.random())

export type Post = { id: number; title: string; body: string; userId: number }
export type Album = { id: number; title: string; userId: number }
export type Todo = { id: number; title: string; completed: boolean; userId: number }

export const posts = {
  getMany: async () => {
    await delayRandom(1500)
    return axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts').then(({ data }) => data)
  },
  getOneBy: async ({ id }: { id: Post['id'] }) => {
    await delayRandom(1500)
    return axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).then(({ data }) => data)
  },
}

export const albums = {
  getManyBy: async ({ userId }: { userId: number }) => {
    await delayRandom(1500)
    return axios
      .get<Album[]>(`https://jsonplaceholder.typicode.com/users/${userId}/albums`)
      .then(({ data }) => data.splice(0, 2))
  },
}

export const todos = {
  getManyBy: async ({ userId }: { userId: number }) => {
    await delayRandom(1500)
    return axios
      .get<Todo[]>(`https://jsonplaceholder.typicode.com/users/${userId}/todos`)
      .then(({ data }) => data.splice(0, 2))
  },
}
