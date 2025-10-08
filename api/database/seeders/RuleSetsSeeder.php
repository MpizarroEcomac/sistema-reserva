<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Site;
use App\Models\ResourceType;
use App\Models\RuleSet;

class RuleSetsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sclSite = Site::where('code', 'SCL')->first();
        $lscSite = Site::where('code', 'LSC')->first();
        $salaType = ResourceType::where('code', 'sala')->first();
        $parkingType = ResourceType::where('code', 'parking')->first();

        if (!$sclSite || !$lscSite || !$salaType || !$parkingType) {
            $this->command->error('❌ Error: Deben existir las sedes y tipos de recursos primero');
            return;
        }

        $ruleSets = [
            // ====== REGLAS SALAS SANTIAGO ======
            [
                'site_id' => $sclSite->id,
                'resource_type_id' => $salaType->id,
                'name' => 'Reglas Salas Santiago',
                'operating_hours' => ['08:00-20:00'],
                'min_duration_minutes' => 30,
                'max_duration_minutes' => 180,
                'buffer_minutes' => 10,
                'max_bookings_per_day' => 2,
                'max_advance_days' => 30,
                'blocked_days' => [
                    '2024-12-25', // Navidad
                    '2025-01-01', // Año Nuevo
                    '2025-05-01', // Día del Trabajo
                    '2025-09-18', // Fiestas Patrias
                    '2025-09-19',
                ],
                'special_rules' => [
                    'requires_purpose' => true,
                    'max_attendees_validation' => true,
                    'auto_cancel_no_show' => 15, // minutos
                    'weekend_restricted' => true
                ],
                'is_active' => true
            ],
            // ====== REGLAS PARKING SANTIAGO ======
            [
                'site_id' => $sclSite->id,
                'resource_type_id' => $parkingType->id,
                'name' => 'Reglas Parking Santiago',
                'operating_hours' => ['08:00-20:00'],
                'min_duration_minutes' => 30,
                'max_duration_minutes' => 600, // 10 horas
                'buffer_minutes' => 0,
                'max_bookings_per_day' => 2,
                'max_advance_days' => 30,
                'blocked_days' => [
                    '2024-12-25',
                    '2025-01-01'
                ],
                'special_rules' => [
                    'requires_license_plate' => true,
                    'electric_charger_priority' => true,
                    'weekend_extended_hours' => ['08:00-22:00']
                ],
                'is_active' => true
            ],
            // ====== REGLAS SALAS LA SERENA ======
            [
                'site_id' => $lscSite->id,
                'resource_type_id' => $salaType->id,
                'name' => 'Reglas Salas La Serena',
                'operating_hours' => ['08:30-19:00'],
                'min_duration_minutes' => 30,
                'max_duration_minutes' => 180,
                'buffer_minutes' => 10,
                'max_bookings_per_day' => 2,
                'max_advance_days' => 30,
                'blocked_days' => [
                    '2024-12-25',
                    '2025-01-01',
                    '2025-05-01',
                    '2025-09-18',
                    '2025-09-19',
                ],
                'special_rules' => [
                    'requires_purpose' => true,
                    'max_attendees_validation' => true,
                    'auto_cancel_no_show' => 15,
                    'weekend_restricted' => true,
                    'lunch_break' => '13:00-14:00' // Pausa almuerzo
                ],
                'is_active' => true
            ],
            // ====== REGLAS PARKING LA SERENA ======
            [
                'site_id' => $lscSite->id,
                'resource_type_id' => $parkingType->id,
                'name' => 'Reglas Parking La Serena',
                'operating_hours' => ['08:30-19:00'],
                'min_duration_minutes' => 30,
                'max_duration_minutes' => 600,
                'buffer_minutes' => 0,
                'max_bookings_per_day' => 2,
                'max_advance_days' => 30,
                'blocked_days' => [
                    '2024-12-25',
                    '2025-01-01'
                ],
                'special_rules' => [
                    'requires_license_plate' => true,
                    'outdoor_parking_weather_alert' => true,
                    'weekend_extended_hours' => ['08:00-20:00']
                ],
                'is_active' => true
            ]
        ];

        foreach ($ruleSets as $ruleData) {
            RuleSet::updateOrCreate(
                [
                    'site_id' => $ruleData['site_id'],
                    'resource_type_id' => $ruleData['resource_type_id']
                ],
                $ruleData
            );
        }

        $this->command->info('✅ Reglas creadas:');
        $this->command->info('  - Santiago: Salas (30-180 min, buffer 10 min) + Parking (30-600 min)');
        $this->command->info('  - La Serena: Salas (30-180 min, buffer 10 min) + Parking (30-600 min)');
        $this->command->info('  - Todas las reglas incluyen: máx 2 reservas/día, 30 días anticipación');
    }
}
