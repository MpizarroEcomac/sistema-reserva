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
        Schema::create('resource_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique(); // sala, parking, locker, etc.
            $table->string('name'); // Sala de Reuniones, Estacionamiento, etc.
            $table->string('icon')->nullable(); // Icono para UI
            $table->text('description')->nullable();
            $table->boolean('requires_capacity')->default(false); // Si tiene capacidad
            $table->boolean('requires_equipment')->default(false); // Si tiene equipamiento
            $table->json('default_rules')->nullable(); // Reglas por defecto
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_types');
    }
};
