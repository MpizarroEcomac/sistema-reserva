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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->string('booking_code', 20)->unique(); // BOOK-2024-001
            $table->datetime('start_at'); // Inicio de la reserva
            $table->datetime('end_at'); // Fin de la reserva
            $table->string('status')->default('confirmed'); // confirmed, cancelled, completed, no_show
            $table->string('purpose')->nullable(); // Propósito de la reserva
            $table->integer('attendees')->nullable(); // Número de asistentes
            $table->string('license_plate')->nullable(); // Para estacionamientos
            $table->text('notes')->nullable(); // Notas adicionales
            $table->json('metadata')->nullable(); // Datos adicionales
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict'); // Quién creó la reserva
            $table->datetime('cancelled_at')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            
            // Índices para anti-solapamiento y consultas rápidas
            $table->index(['resource_id', 'start_at', 'end_at']);
            $table->index(['user_id', 'status']);
            $table->index(['start_at', 'status']);
            $table->index(['booking_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
