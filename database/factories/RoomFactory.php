<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Room;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        static $roomNumber = 100;
        $roomNumber++;

        return [
    'room_number' => 'R' . $this->faker->unique()->numberBetween(100, 999),
    'room_type' => $this->faker->randomElement(['Standard','Deluxe','Suite']),
    'capacity' => $this->faker->numberBetween(1, 5),
    'price' => $this->faker->numberBetween(1000, 5000),
    'description' => $this->faker->sentence(),
    'status' => 'available',
];

    }
}