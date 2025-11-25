<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\AuthController;

//Test Route
Route::get('/test', function(Request $request){
    return response()->json(['message' => 'API is working fine']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});


//Get all rooms
Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'index']);

//Get a single room
Route::get('/rooms/{id}', [App\Http\Controllers\RoomController::class, 'show']);

//Create a new room
Route::post('/rooms', [App\Http\Controllers\RoomController::class, 'store']);

//Update a room
Route::put('/rooms/{id}', [App\Http\Controllers\RoomController::class, 'update']);

//Delete a room
Route::delete('/rooms/{id}', [App\Http\Controllers\RoomController::class, 'destroy']);
