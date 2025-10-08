<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class MfaCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'secret',
        'public_key',
        'backup_codes',
        'last_used_at',
        'is_active',
    ];

    protected $casts = [
        'public_key' => 'array',
        'backup_codes' => 'array',
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'secret',
        'backup_codes',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeTotp($query)
    {
        return $query->where('type', 'totp');
    }

    public function scopeWebauthn($query)
    {
        return $query->where('type', 'webauthn');
    }

    public function scopeBackupCodes($query)
    {
        return $query->where('type', 'backup_codes');
    }

    // Métodos de utilidad
    public function getDecryptedSecret(): ?string
    {
        return $this->secret ? Crypt::decryptString($this->secret) : null;
    }

    public function setEncryptedSecret(string $secret): void
    {
        $this->secret = Crypt::encryptString($secret);
    }

    public function isTotp(): bool
    {
        return $this->type === 'totp';
    }

    public function isWebauthn(): bool
    {
        return $this->type === 'webauthn';
    }

    public function isBackupCodes(): bool
    {
        return $this->type === 'backup_codes';
    }

    public function markAsUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }
}
