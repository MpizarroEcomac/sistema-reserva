<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name', 
        'address',
        'timezone',
        'operating_hours',
        'is_active',
        'description',
        'metadata',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    // Relaciones
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class);
    }

    public function ruleSets(): HasMany
    {
        return $this->hasMany(RuleSet::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }
}
