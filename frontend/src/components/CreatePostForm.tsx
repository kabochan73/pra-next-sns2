'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  book_title: z.string().min(1, '本のタイトルを入力してください'),
  book_author: z.string().optional(),
  content: z.string().min(1, 'コメントを入力してください'),
})

type FormData = z.infer<typeof schema>

export default function CreatePostForm() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiClient.post('/posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      reset()
      setOpen(false)
    },
  })

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 bg-white border rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
      >
        読んだ本をシェアしよう...
      </button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">読んだ本をシェア</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="book_title">本のタイトル *</Label>
            <Input id="book_title" placeholder="例：Clean Code" {...register('book_title')} />
            {errors.book_title && <p className="text-xs text-red-500">{errors.book_title.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="book_author">著者</Label>
            <Input id="book_author" placeholder="例：Robert C. Martin" {...register('book_author')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="content">一言コメント *</Label>
            <textarea
              id="content"
              rows={3}
              placeholder="この本のどこが良かったか..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('content')}
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? '投稿中...' : '投稿する'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
