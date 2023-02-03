import { Suspense } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { albums, posts, todos } from './api'
import { Spinner } from '../uis'

export const PostListSuspensive = () => {
  const postsQuery = useSuspenseQuery(['posts'], posts.getMany)

  return (
    <ul style={{ maxWidth: 600 }}>
      {postsQuery.data.map((post) => (
        <li key={post.id}>
          <h3>Title: {post.title}</h3>
          <Suspense.CSROnly fallback={<Spinner />}>
            <Post id={post.id} />
          </Suspense.CSROnly>
        </li>
      ))}
    </ul>
  )
}

export const Post = ({ id }: { id: number }) => {
  const postQuery = useSuspenseQuery(['posts', id], () => posts.getOneBy({ id }))
  const albumsQuery = useSuspenseQuery(['users', postQuery.data.userId, 'albums'], () =>
    albums.getManyBy({ userId: postQuery.data.userId })
  )
  const todosQuery = useSuspenseQuery(['users', postQuery.data.userId, 'todos'], () =>
    todos.getManyBy({ userId: postQuery.data.userId })
  )

  return (
    <div>
      <p>Body: {postQuery.data.body}</p>
      <h5>Album List:</h5>
      <ul>
        {albumsQuery.data.map((album) => (
          <li key={album.id}>{album.title}</li>
        ))}
      </ul>
      <h5>Todo List:</h5>
      <ul>
        {todosQuery.data.map((todo) => (
          <li key={todo.id}>
            <button>{todo.completed ? 'completed' : 'todo'}</button> {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
