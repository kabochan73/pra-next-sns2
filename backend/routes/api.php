<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\FollowController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// 認証不要
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 認証必要
Route::middleware('auth:sanctum')->group(function () {
    // 認証
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // 投稿
    Route::get('/feed', [PostController::class, 'feed']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);

    // いいね
    Route::post('/posts/{post}/like', [LikeController::class, 'toggle']);

    // コメント
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // ユーザー
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::get('/users/{user}/posts', [UserController::class, 'posts']);

    // フォロー
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle']);
});
