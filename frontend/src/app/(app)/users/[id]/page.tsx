'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import apiClient from '@/lib/axios'
import PostCard from '@/components/PostCard'
import CreatePostForm from '@/components/CreatePostForm'

type Profile = {
  id: number
  name: string
  bio: string | null
  avatar: string | null
  posts_count: number
  followers_count: number
  followings_count: number
  is_following: boolean
  is_me: boolean
}

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

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ['user', id],
    queryFn: () => apiClient.get(`/users/${id}`).then((res) => res.data),
  })

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', id],
    queryFn: () => apiClient.get(`/users/${id}/posts`).then((res) => res.data),
  })

  const posts: Post[] = postsData?.data ?? []

  const followMutation = useMutation({
    mutationFn: () => apiClient.post(`/users/${id}/follow`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', id] }),
  })

  if (profileLoading) {
    return <div className="text-center py-10 text-gray-400">読み込み中...</div>
  }

  if (!profile) {
    return <div className="text-center py-10 text-gray-400">ユーザーが見つかりません</div>
  }

  return (
    <div className="space-y-6">
      {/* プロフィールカード */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {profile.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile.name}</h1>
              {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
            </div>
          </div>

          {!profile.is_me && (
            <button
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                profile.is_following
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {profile.is_following ? 'フォロー中' : 'フォロー'}
            </button>
          )}
        </div>

        {/* 統計 */}
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{profile.posts_count}</p>
            <p className="text-gray-500">投稿</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{profile.followers_count}</p>
            <p className="text-gray-500">フォロワー</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{profile.followings_count}</p>
            <p className="text-gray-500">フォロー中</p>
          </div>
        </div>
      </div>

      {/* 投稿フォーム（自分のプロフィールのみ） */}
      {profile.is_me && (
        <CreatePostForm
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['user-posts', id] })}
        />
      )}

      {/* 投稿一覧 */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700">投稿した本</h2>

        {postsLoading && (
          <div className="text-center py-6 text-gray-400">読み込み中...</div>
        )}

        {!postsLoading && posts.length === 0 && (
          <div className="text-center py-6 text-gray-400">まだ投稿がありません</div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
