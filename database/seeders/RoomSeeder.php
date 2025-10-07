<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to safely delete
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Delete existing rooms
        DB::table('rooms')->delete();

        // Reset auto-increment
        DB::statement('ALTER TABLE rooms AUTO_INCREMENT = 1;');

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Seed new rooms with unique room numbers
        Room::factory()->count(10)->create();
    }
}