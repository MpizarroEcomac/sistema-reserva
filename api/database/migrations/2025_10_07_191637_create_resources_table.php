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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_type_id')->constrained()->onDelete('restrict');
            $table->string('code', 50); // SCL-S1, LSC-P01, etc.
            $table->string('name'); // Sala 1, Parking 01, etc.
            $table->text('description')->nullable();
            $table->integer('capacity')->nullable(); // Para salas
            $table->json('equipment')->nullable(); // ['proyector', 'pizarra']
            $table->json('attributes')->nullable(); // Atributos específicos
            $table->string('location')->nullable(); // Piso 2, Sector A, etc.
            $table->json('tags')->nullable(); // Etiquetas para filtrado
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['site_id', 'code']); // Código único por sede
            $table->index(['site_id', 'resource_type_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
