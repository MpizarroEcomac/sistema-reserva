<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Site;

class SitesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sites = [
            [
                'code' => 'SCL',
                'name' => 'Santiago',
                'address' => 'Av. Providencia 1208, Santiago, Chile',
                'timezone' => 'America/Santiago',
                'operating_hours' => [
                    'monday-friday' => '08:00-20:00',
                    'saturday' => '09:00-14:00'
                ],
                'is_active' => true,
                'description' => 'Oficina principal en Santiago, Región Metropolitana',
                'metadata' => [
                    'total_floors' => 5,
                    'parking_levels' => 2,
                    'emergency_contact' => '+56 2 2234 5678',
                    'wifi_network' => 'Empresa-SCL'
                ]
            ],
            [
                'code' => 'LSC',
                'name' => 'La Serena',
                'address' => 'Av. del Mar 2000, La Serena, Chile',
                'timezone' => 'America/Santiago',
                'operating_hours' => [
                    'monday-friday' => '08:30-19:00',
                    'saturday' => '09:00-13:00'
                ],
                'is_active' => true,
                'description' => 'Sucursal La Serena, Región de Coquimbo',
                'metadata' => [
                    'total_floors' => 3,
                    'parking_levels' => 1,
                    'emergency_contact' => '+56 51 222 3344',
                    'wifi_network' => 'Empresa-LSC'
                ]
            ]
        ];

        foreach ($sites as $siteData) {
            Site::updateOrCreate(
                ['code' => $siteData['code']],
                $siteData
            );
        }

        $this->command->info('✅ Sedes creadas: Santiago (SCL) y La Serena (LSC)');
    }
}
