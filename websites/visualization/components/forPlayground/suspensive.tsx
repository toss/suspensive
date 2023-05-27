import { useEffect, useRef, useState } from 'react'
import { Suspense } from '@suspensive/react'
import { useSuspenseQueries, useSuspenseQuery } from '@suspensive/react-query'
import { Post, albums, posts, todos } from './api'
import { useIntersectionObserver } from './useIntersectionObserver'

export const PostListSuspensive = () => {
  const postsQuery = useSuspenseQuery({
    queryKey: ['posts'] as const,
    queryFn: posts.getMany,
  })

  return (
    <ul style={{ maxWidth: 600 }}>
      {postsQuery.data.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </ul>
  )
}

const PostListItem = ({ post }: { post: Post }) => {
  const ref = useRef(null)
  const entry = useIntersectionObserver(ref)
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    if (entry?.isIntersecting) {
      setIsShow(true)
    }
  }, [entry?.isIntersecting])

  return (
    <li key={post.id} ref={ref} style={{ minHeight: 200 }}>
      <h3>Title: {post.title}</h3>
      {isShow && (
        <Suspense.CSROnly>
          <PostContent id={post.id} />
        </Suspense.CSROnly>
      )}
    </li>
  )
}

const PostContent = ({ id }: { id: number }) => {
  const postQuery = useSuspenseQuery({
    queryKey: ['suspensive', 'posts', id] as const,
    queryFn: () => posts.getOneBy({ id }),
  })
  const [albumsQuery, todosQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['suspensive', 'users', postQuery.data.userId, 'albums'],
        queryFn: () => albums.getManyBy({ userId: postQuery.data.userId }),
      },
      {
        queryKey: ['suspensive', 'users', postQuery.data.userId, 'todos'],
        queryFn: () => todos.getManyBy({ userId: postQuery.data.userId }),
      },
    ] as const,
  })

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
            <button type="button">{todo.completed ? 'completed' : 'todo'}</button> {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
