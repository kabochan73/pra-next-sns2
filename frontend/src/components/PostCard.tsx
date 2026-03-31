'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, BookOpen, Trash2 } from 'lucide-react'
import apiClient from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Comment = {
  id: number
  user_id: number
  content: string
  user: { id: number; name: string }
  created_at: string
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
  comments: Comment[]
  comments_count: number
  created_at: string
}

export default function PostCard({ post }: { post: Post }) {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const isLiked = post.likes.some((l) => l.user_id === user?.id)

  const likeMutation = useMutation({
    mutationFn: () => apiClient.post(`/posts/${post.id}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  })

  const commentMutation = useMutation({
    mutationFn: (content: string) => apiClient.post(`/posts/${post.id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      setCommentText('')
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => apiClient.delete(`/comments/${commentId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  })

  const deletePostMutation = useMutation({
    mutationFn: () => apiClient.delete(`/posts/${post.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  })

  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      {/* ユーザー情報 */}
      <div className="flex items-center justify-between">
        <Link href={`/users/${post.user.id}`} className="flex items-center gap-2 hover:opacity-75 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {post.user.name[0]}
          </div>
          <span className="font-medium text-sm">{post.user.name}</span>
        </Link>
        {user?.id === post.user.id && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-gray-400 hover:text-red-500"
            onClick={() => deletePostMutation.mutate()}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 本の情報 */}
      <div className="flex gap-3 bg-gray-50 rounded-lg p-3">
        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-sm">{post.book_title}</p>
          {post.book_author && <p className="text-xs text-gray-500">{post.book_author}</p>}
        </div>
      </div>

      {/* コメント本文 */}
      <p className="text-sm text-gray-800">{post.content}</p>

      {/* アクション */}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={() => likeMutation.mutate()}
          className={`flex items-center gap-1 text-sm transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes_count}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {/* コメントセクション */}
      {showComments && (
        <div className="space-y-2 pt-1 border-t">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start justify-between gap-2 text-sm">
              <div className="flex gap-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-gray-600">{comment.content}</span>
              </div>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                  className="text-gray-300 hover:text-red-400 shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを入力..."
              className="h-8 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  commentMutation.mutate(commentText.trim())
                }
              }}
            />
            <Button
              size="sm"
              className="h-8"
              disabled={!commentText.trim() || commentMutation.isPending}
              onClick={() => commentMutation.mutate(commentText.trim())}
            >
              送信
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
