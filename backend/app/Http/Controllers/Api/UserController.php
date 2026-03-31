<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // ユーザープロフィール取得
    public function show(Request $request, User $user)
    {
        $me = $request->user();

        return response()->json([
            'id'              => $user->id,
            'name'            => $user->name,
            'bio'             => $user->bio,
            'avatar'          => $user->avatar,
            'posts_count'     => $user->posts()->count(),
            'followers_count' => $user->followers()->count(),
            'followings_count'=> $user->followings()->count(),
            'is_following'    => $user->followers()->where('follower_id', $me->id)->exists(),
            'is_me'           => $me->id === $user->id,
        ]);
    }

    // ユーザーの投稿一覧
    public function posts(User $user)
    {
        $posts = $user->posts()
            ->with(['user', 'likes', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(20);

        return response()->json($posts);
    }
}
