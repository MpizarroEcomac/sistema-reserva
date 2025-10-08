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
        Schema::create('mfa_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // totp, webauthn, backup_codes
            $table->string('name')->nullable(); // Nombre del dispositivo/app
            $table->text('secret')->nullable(); // Secret para TOTP (encriptado)
            $table->json('public_key')->nullable(); // Para WebAuthn
            $table->json('backup_codes')->nullable(); // Códigos de backup
            $table->datetime('last_used_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['user_id', 'type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mfa_credentials');
    }
};
