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
    Route::get('/profile', [AuthController::class, 'profile']);
});


//Get all rooms
Route::get('/rooms', [RoomController::class, 'index']);

//Get a single room
Route::get('/rooms/{id}', [RoomController::class, 'show']);

//Create a new room
Route::post('/rooms', [RoomController::class, 'store']);

//Update a room
Route::put('/rooms/{id}', [RoomController::class, 'update']);

//Delete a room
Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);

//Toggle room availability status
Route::patch('/rooms/{id}/toggle-status', [RoomController::class, 'toggleRoomStatus']);

