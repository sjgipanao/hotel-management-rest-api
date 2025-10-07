<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

//Test Route
Route::get('/test', function(Request $request){
    return response()->json(['message' => 'API is working fine']);
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

//Toggle room availability status
Route::patch('/rooms/{id}/toggle-status', [App\Http\Controllers\RoomController::class, 'toggleRoomStatus']);

