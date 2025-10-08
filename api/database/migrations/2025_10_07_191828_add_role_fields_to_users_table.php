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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user'); // user, reception, site_admin, super_admin
            $table->foreignId('site_id')->nullable()->constrained()->onDelete('set null'); // Para site_admin
            $table->string('phone')->nullable();
            $table->string('employee_id')->nullable();
            $table->string('department')->nullable();
            $table->boolean('mfa_enabled')->default(false);
            $table->datetime('last_login_at')->nullable();
            $table->boolean('is_active')->default(true);
            
            $table->index(['role', 'site_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropColumn([
                'role', 'site_id', 'phone', 'employee_id', 
                'department', 'mfa_enabled', 'last_login_at', 'is_active'
            ]);
        });
    }
};
