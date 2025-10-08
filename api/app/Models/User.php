<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'site_id',
        'phone',
        'employee_id',
        'department',
        'mfa_enabled',
        'last_login_at',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
        'mfa_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relaciones
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function createdBookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'created_by');
    }

    public function mfaCredentials(): HasMany
    {
        return $this->hasMany(MfaCredential::class);
    }

    // Scopes para RBAC
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeBySite($query, $siteId)
    {
        return $query->where('site_id', $siteId);
    }

    // Métodos de RBAC
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isReception(): bool
    {
        return $this->role === 'reception';
    }

    public function isSiteAdmin(): bool
    {
        return $this->role === 'site_admin';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function canManageSite($siteId): bool
    {
        return $this->isSuperAdmin() || 
               ($this->isSiteAdmin() && $this->site_id == $siteId);
    }

    public function canCreateBookingFor(User $user): bool
    {
        return $this->id === $user->id || 
               $this->hasAnyRole(['reception', 'site_admin', 'super_admin']);
    }

    public function canViewOtherUserBookings(): bool
    {
        return $this->hasAnyRole(['reception', 'site_admin', 'super_admin']);
    }
}
