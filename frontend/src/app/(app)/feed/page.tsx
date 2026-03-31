'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import CreatePostForm from '@/components/CreatePostForm'
import PostCard from '@/components/PostCard'

type Post = {
  id: number
  book_title: string
  book_author: string | null
  book_image: string | null
  content: string
  user: { id: number; name: string }
  likes: { user_id: number }[]
  likes_count: number
  comments: { id: number; user_id: number; content: string; user: { id: number; name: string }; created_at: string }[]
  comments_count: number
  created_at: string
}

export default function FeedPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['feed'],
    queryFn: () => apiClient.get('/feed').then((res) => res.data),
  })

  const posts: Post[] = data?.data ?? []

  return (
    <div className="space-y-4">
      <CreatePostForm />

      {isLoading && (
        <div className="text-center py-10 text-gray-400">読み込み中...</div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-400">読み込みに失敗しました</div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          まだ投稿がありません。最初の1冊をシェアしてみましょう！
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
