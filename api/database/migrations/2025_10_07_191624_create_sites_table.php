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
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // SCL, LSC, ANF, etc.
            $table->string('name'); // Santiago, La Serena, etc.
            $table->text('address')->nullable();
            $table->string('timezone')->default('America/Santiago');
            $table->json('operating_hours')->nullable(); // {'mon-fri': '08:00-20:00'}
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // Campos adicionales
            $table->timestamps();
            
            $table->index(['code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
