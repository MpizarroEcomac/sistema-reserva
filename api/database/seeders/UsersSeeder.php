<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Site;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sclSite = Site::where('code', 'SCL')->first();
        $lscSite = Site::where('code', 'LSC')->first();

        $users = [
            // Super Admin
            [
                'name' => 'Macarena Pizarro',
                'email' => 'admin@empresa.com',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'site_id' => null,
                'phone' => '+56 9 9999 0001',
                'employee_id' => 'EMP-001',
                'department' => 'IT',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            // Site Admin Santiago
            [
                'name' => 'Admin Santiago',
                'email' => 'admin.scl@empresa.com',
                'password' => Hash::make('scl123'),
                'role' => 'site_admin',
                'site_id' => $sclSite?->id,
                'phone' => '+56 2 2234 5670',
                'employee_id' => 'SCL-001',
                'department' => 'Administración',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            // Site Admin La Serena
            [
                'name' => 'Admin La Serena',
                'email' => 'admin.lsc@empresa.com',
                'password' => Hash::make('lsc123'),
                'role' => 'site_admin',
                'site_id' => $lscSite?->id,
                'phone' => '+56 51 222 3340',
                'employee_id' => 'LSC-001',
                'department' => 'Administración',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            // Recepción Santiago
            [
                'name' => 'Recepción SCL',
                'email' => 'recepcion.scl@empresa.com',
                'password' => Hash::make('recep123'),
                'role' => 'reception',
                'site_id' => $sclSite?->id,
                'phone' => '+56 2 2234 5671',
                'employee_id' => 'SCL-REC01',
                'department' => 'Recepción',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            // Usuarios regulares
            [
                'name' => 'Juan Pérez',
                'email' => 'juan.perez@empresa.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'site_id' => null,
                'phone' => '+56 9 8888 0001',
                'employee_id' => 'EMP-101',
                'department' => 'Ventas',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'María González',
                'email' => 'maria.gonzalez@empresa.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'site_id' => null,
                'phone' => '+56 9 7777 0002',
                'employee_id' => 'EMP-102',
                'department' => 'Marketing',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Carlos Silva',
                'email' => 'carlos.silva@empresa.com',
                'password' => Hash::make('user123'),
                'role' => 'user',
                'site_id' => null,
                'phone' => '+56 9 6666 0003',
                'employee_id' => 'EMP-103',
                'department' => 'Desarrollo',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        $this->command->info('✅ Usuarios creados con roles: SuperAdmin, SiteAdmins, Recepción, Usuarios');
        $this->command->info('  - admin@empresa.com (super_admin) - Password: admin123');
        $this->command->info('  - admin.scl@empresa.com (site_admin SCL) - Password: scl123');
        $this->command->info('  - admin.lsc@empresa.com (site_admin LSC) - Password: lsc123');
        $this->command->info('  - juan.perez@empresa.com (user) - Password: user123');
    }
}
