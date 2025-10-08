<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando seeders del Sistema de Reservas...');
        
        // Orden importante: primero las entidades básicas, luego las dependientes
        $this->call([
            SitesSeeder::class,           // 1. Sedes (SCL, LSC)
            ResourceTypesSeeder::class,   // 2. Tipos de recursos (sala, parking)
            UsersSeeder::class,           // 3. Usuarios con roles
            ResourcesSeeder::class,       // 4. Recursos específicos (salas y parkings)
            RuleSetsSeeder::class,        // 5. Reglas por sede/tipo
        ]);

        $this->command->info('');
        $this->command->info('✅ ¡Sistema de Reservas listo!');
        $this->command->info('🏢 Sedes: Santiago (SCL) y La Serena (LSC)');
        $this->command->info('💼 Recursos: 8 salas + 20 estacionamientos');
        $this->command->info('👥 Usuarios: SuperAdmin, SiteAdmins, Recepción, Usuarios regulares');
        $this->command->info('');
        $this->command->info('🔑 Accesos:');
        $this->command->info('  Super Admin: admin@empresa.com / admin123');
        $this->command->info('  Admin SCL: admin.scl@empresa.com / scl123');
        $this->command->info('  Usuario: juan.perez@empresa.com / user123');
    }
}
