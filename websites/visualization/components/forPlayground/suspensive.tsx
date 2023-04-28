import { Suspense } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { albums, Post, posts, todos } from './api'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useEffect, useRef, useState } from 'react'

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
    queryKey: ['posts', id] as const,
    queryFn: () => posts.getOneBy({ id }),
  })
  const albumsQuery = useSuspenseQuery({
    queryKey: ['users', postQuery.data.userId, 'albums'] as const,
    queryFn: () => albums.getManyBy({ userId: postQuery.data.userId }),
  })
  const todosQuery = useSuspenseQuery({
    queryKey: ['users', postQuery.data.userId, 'todos'] as const,
    queryFn: () => todos.getManyBy({ userId: postQuery.data.userId }),
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
            <button>{todo.completed ? 'completed' : 'todo'}</button> {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
