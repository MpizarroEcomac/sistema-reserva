<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ResourceType;

class ResourceTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resourceTypes = [
            [
                'code' => 'sala',
                'name' => 'Sala de Reuniones',
                'icon' => '💼',
                'description' => 'Salas equipadas para reuniones de trabajo y presentaciones',
                'requires_capacity' => true,
                'requires_equipment' => true,
                'default_rules' => [
                    'min_duration' => 30,
                    'max_duration' => 180,
                    'buffer_minutes' => 10
                ],
                'is_active' => true
            ],
            [
                'code' => 'parking',
                'name' => 'Estacionamiento',
                'icon' => '🏎️',
                'description' => 'Espacios de estacionamiento para vehículos',
                'requires_capacity' => false,
                'requires_equipment' => false,
                'default_rules' => [
                    'min_duration' => 30,
                    'max_duration' => 600,
                    'buffer_minutes' => 0
                ],
                'is_active' => true
            ],
            [
                'code' => 'locker',
                'name' => 'Locker',
                'icon' => '🗄',
                'description' => 'Casilleros para guardar pertenencias personales',
                'requires_capacity' => false,
                'requires_equipment' => false,
                'default_rules' => [
                    'min_duration' => 60,
                    'max_duration' => 480,
                    'buffer_minutes' => 0
                ],
                'is_active' => false // Futuro
            ]
        ];

        foreach ($resourceTypes as $typeData) {
            ResourceType::updateOrCreate(
                ['code' => $typeData['code']],
                $typeData
            );
        }

        $this->command->info('✅ Tipos de recursos creados: Salas, Estacionamientos, Lockers');
    }
}
