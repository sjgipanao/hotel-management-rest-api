<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create( [
            'first_name'    => 'admin',
            'last_name'     => 'Admin',
            'name'          => 'adminuser',
            'email'         => 'admin@example.com',
            'mobile_number' => '1234567890',
            'address'       => 'Admin Address',
            'user_type'     => 'admin',
            'password'      => Hash::make('password296'),
        ]);

        $this->call(RoomSeeder::class);
    }
}
