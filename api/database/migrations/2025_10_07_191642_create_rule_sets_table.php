<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rule_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_type_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Reglas Salas Santiago, etc.
            $table->json('operating_hours'); // ['08:00-20:00']
            $table->integer('min_duration_minutes')->default(30); // Duración mínima
            $table->integer('max_duration_minutes')->default(180); // Duración máxima
            $table->integer('buffer_minutes')->default(0); // Buffer entre reservas
            $table->integer('max_bookings_per_day')->default(2); // Límite por usuario/día
            $table->integer('max_advance_days')->default(30); // Anticipo máximo
            $table->json('blocked_days')->nullable(); // Días bloqueados ['2024-12-25']
            $table->json('special_rules')->nullable(); // Reglas especiales
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['site_id', 'resource_type_id']); // Una regla por sede/tipo
            $table->index(['site_id', 'resource_type_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rule_sets');
    }
};
