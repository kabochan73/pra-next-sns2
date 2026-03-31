<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    // フォロー or フォロー解除（トグル）
    public function toggle(Request $request, User $user)
    {
        $me = $request->user();

        if ($me->id === $user->id) {
            return response()->json(['message' => '自分自身をフォローできません'], 422);
        }

        $follow = $me->followings()->where('following_id', $user->id)->first();

        if ($follow) {
            $follow->delete();
            $following = false;
        } else {
            $me->followings()->create(['following_id' => $user->id]);
            $following = true;
        }

        return response()->json([
            'following'       => $following,
            'followers_count' => $user->followers()->count(),
        ]);
    }
}
