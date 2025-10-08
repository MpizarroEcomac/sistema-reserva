<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Site;
use App\Models\ResourceType;
use App\Models\Resource;

class ResourcesSeeder extends Seeder
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

        $resources = [];

        // ====== SANTIAGO (SCL) RESOURCES ======
        
        // Salas Santiago
        $salasSCL = [
            ['code' => 'SCL-S1', 'name' => 'Sala Ejecutiva 1', 'capacity' => 8, 'location' => 'Piso 3', 
             'equipment' => ['proyector', 'pizarra', 'tv_65', 'videoconferencia'], 
             'tags' => ['ejecutiva', 'videoconferencia']],
            ['code' => 'SCL-S2', 'name' => 'Sala Ejecutiva 2', 'capacity' => 12, 'location' => 'Piso 3',
             'equipment' => ['proyector', 'pizarra', 'tv_55'],
             'tags' => ['ejecutiva', 'grande']],
            ['code' => 'SCL-S3', 'name' => 'Sala Reuniones A', 'capacity' => 6, 'location' => 'Piso 2',
             'equipment' => ['tv_43', 'pizarra'],
             'tags' => ['reuniones', 'pequeña']],
            ['code' => 'SCL-S4', 'name' => 'Sala Reuniones B', 'capacity' => 10, 'location' => 'Piso 2',
             'equipment' => ['proyector', 'pizarra', 'tv_50'],
             'tags' => ['reuniones', 'mediana']],
        ];

        foreach ($salasSCL as $sala) {
            $resources[] = array_merge($sala, [
                'site_id' => $sclSite->id,
                'resource_type_id' => $salaType->id,
                'description' => "Sala de reuniones ubicada en {$sala['location']}",
                'attributes' => ['ac' => true, 'wifi' => true, 'catering' => $sala['capacity'] >= 8],
                'is_active' => true
            ]);
        }

        // Estacionamientos Santiago  
        for ($i = 1; $i <= 10; $i++) {
            $code = 'SCL-P' . str_pad($i, 2, '0', STR_PAD_LEFT);
            $level = $i <= 5 ? 'Subterráneo 1' : 'Subterráneo 2';
            $resources[] = [
                'site_id' => $sclSite->id,
                'resource_type_id' => $parkingType->id,
                'code' => $code,
                'name' => "Parking {$i}",
                'description' => "Estacionamiento ubicado en {$level}",
                'capacity' => null,
                'equipment' => null,
                'attributes' => [
                    'level' => $level,
                    'covered' => true,
                    'electric_charger' => $i <= 2
                ],
                'location' => $level,
                'tags' => $i <= 2 ? ['electrico'] : ['normal'],
                'is_active' => true
            ];
        }

        // ====== LA SERENA (LSC) RESOURCES ======
        
        // Salas La Serena
        $salasLSC = [
            ['code' => 'LSC-S1', 'name' => 'Sala Principal', 'capacity' => 10, 'location' => 'Piso 2',
             'equipment' => ['proyector', 'pizarra', 'tv_55', 'videoconferencia'],
             'tags' => ['principal', 'videoconferencia']],
            ['code' => 'LSC-S2', 'name' => 'Sala Reuniones', 'capacity' => 6, 'location' => 'Piso 2',
             'equipment' => ['tv_43', 'pizarra'],
             'tags' => ['reuniones', 'pequeña']],
            ['code' => 'LSC-S3', 'name' => 'Sala Capacitación', 'capacity' => 15, 'location' => 'Piso 1',
             'equipment' => ['proyector', 'pizarra', 'tv_65', 'audio'],
             'tags' => ['capacitacion', 'grande']],
            ['code' => 'LSC-S4', 'name' => 'Sala Privada', 'capacity' => 4, 'location' => 'Piso 3',
             'equipment' => ['tv_32'],
             'tags' => ['privada', 'pequeña']],
        ];

        foreach ($salasLSC as $sala) {
            $resources[] = array_merge($sala, [
                'site_id' => $lscSite->id,
                'resource_type_id' => $salaType->id,
                'description' => "Sala de reuniones ubicada en {$sala['location']}",
                'attributes' => ['ac' => true, 'wifi' => true, 'catering' => $sala['capacity'] >= 8],
                'is_active' => true
            ]);
        }

        // Estacionamientos La Serena
        for ($i = 1; $i <= 10; $i++) {
            $code = 'LSC-P' . str_pad($i, 2, '0', STR_PAD_LEFT);
            $level = 'Planta Baja';
            $resources[] = [
                'site_id' => $lscSite->id,
                'resource_type_id' => $parkingType->id,
                'code' => $code,
                'name' => "Parking {$i}",
                'description' => "Estacionamiento al aire libre",
                'capacity' => null,
                'equipment' => null,
                'attributes' => [
                    'level' => $level,
                    'covered' => false,
                    'electric_charger' => false
                ],
                'location' => $level,
                'tags' => ['exterior'],
                'is_active' => true
            ];
        }

        // Crear todos los recursos
        foreach ($resources as $resourceData) {
            Resource::updateOrCreate(
                [
                    'site_id' => $resourceData['site_id'],
                    'code' => $resourceData['code']
                ],
                $resourceData
            );
        }

        $this->command->info('✅ Recursos creados:');
        $this->command->info('  - Santiago: 4 salas + 10 estacionamientos');
        $this->command->info('  - La Serena: 4 salas + 10 estacionamientos');
        $this->command->info('  - Total: 8 salas, 20 estacionamientos');
    }
}
