<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated extends Authenticate
{
    /**
     * Get the path the user should be redirected to when they are authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (Auth::check()) {
            return route('dashboard');
        }
    }
}