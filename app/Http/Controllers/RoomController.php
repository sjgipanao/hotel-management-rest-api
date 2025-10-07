<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{

    public function index() {
       $rooms = Room::all();

       if($rooms->isEmpty()){
        return response()->json([
            'status' => 'error',
            'message' => 'No rooms found',
         ], 404);
       }
       
         return response()->json([
            'status' => 'success',
            'message' => 'Rooms retrieved successfully',
            'data' => $rooms
         ], 300);

        
    }
    public function show($id) {
        if ($id) {
            $room = Room::where('id', $id)->first();
            if ($room) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Room retrieved successfully',
                    'data' => $room
                ], 300);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Room not found',
                ], 404);
            }
        } else {
            $rooms = Room::all();
            return response()->json([
                'status' => 'success',
                'message' => 'Rooms retrieved successfully',
                'data' => $rooms
            ], 300);
        }
    }
    public function store(Request $request) {
        $validatedData = $request->validate([
            'room_number' => 'required|unique:rooms,room_number',
            'room_type' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        if($validatedData){
            $room = Room::create([
                'room_number' => $validatedData['room_number'],
                'room_type' => $validatedData['room_type'],
                'capacity' => $validatedData['capacity'],
                'price' => $validatedData['price'],
                'description' => $validatedData['description'] ?? '',
                'status' => $validatedData['status'],
            ]);

            if(!$room){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Room creation failed',
                ], 500);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Room created successfully',
                'data' => $room
            ], 201);
        }
        
    }
    public function update(Request $request, $id) {
        $validatedData = $request->validate([
            'room_number' => 'required|unique:rooms,room_number,'.$id,
            'room_type' => 'sometimes|required|string',
            'capacity' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:available,occupied,maintenance',
        ]);

        $room = Room::where('id', $id)->first();
        if(!$room){
            return response()->json([
                'status' => 'error',
                'message' => 'Room not found',
            ], 404);

}
        $updatedRoom = $room->update([
            'room_number' => $validatedData['room_number'],
                'room_type' => $validatedData['room_type'],
                'capacity' => $validatedData['capacity'],
                'price' => $validatedData['price'],
                'description' => $validatedData['description'] ?? '',
                'status' => $validatedData['status'],
        ]);

        $room->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Room updated successfully',
            'data' => $room
        ], 200);
    }

    public function destroy($id) {
        $room = Room::where('id', $id)->first();
        if(!$room){
            return response()->json([   
                'status' => 'error',
                'message' => 'Room not found',
            ], 404);
    }

    $room->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Room deleted successfully',
        ], 200);
    }

    public function toggleRoomStatus($id) {
}
}