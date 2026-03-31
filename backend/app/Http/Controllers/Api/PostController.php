<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    // フィード（フォロー中 + 自分の投稿、新着順）
    public function feed(Request $request)
    {
        $user = $request->user();
        $followingIds = $user->followings()->pluck('following_id');
        $ids = $followingIds->push($user->id);

        $posts = Post::whereIn('user_id', $ids)
            ->with(['user', 'likes', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(20);

        return response()->json($posts);
    }

    // 投稿一覧（全員）
    public function index()
    {
        $posts = Post::with(['user', 'likes', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(20);

        return response()->json($posts);
    }

    // 投稿作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_title'  => 'required|string|max:255',
            'book_author' => 'nullable|string|max:255',
            'book_image'  => 'nullable|string|max:255',
            'content'     => 'required|string',
        ]);

        $post = $request->user()->posts()->create($validated);
        $post->load('user');
        $post->loadCount(['likes', 'comments']);

        return response()->json($post, 201);
    }

    // 投稿詳細
    public function show(Post $post)
    {
        $post->load(['user', 'likes', 'comments.user']);
        $post->loadCount(['likes', 'comments']);

        return response()->json($post);
    }

    // 投稿削除
    public function destroy(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => '権限がありません'], 403);
        }

        $post->delete();

        return response()->json(['message' => '削除しました']);
    }
}
