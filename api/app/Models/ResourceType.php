<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResourceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'icon',
        'description',
        'requires_capacity',
        'requires_equipment',
        'default_rules',
        'is_active',
    ];

    protected $casts = [
        'default_rules' => 'array',
        'requires_capacity' => 'boolean',
        'requires_equipment' => 'boolean',
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
