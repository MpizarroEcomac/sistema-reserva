<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_id',
        'resource_type_id',
        'code',
        'name',
        'description',
        'capacity',
        'equipment',
        'attributes',
        'location',
        'tags',
        'is_active',
    ];

    protected $casts = [
        'equipment' => 'array',
        'attributes' => 'array',
        'tags' => 'array',
        'is_active' => 'boolean',
        'capacity' => 'integer',
    ];

    // Relaciones
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function resourceType(): BelongsTo
    {
        return $this->belongsTo(ResourceType::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBySite($query, $siteId)
    {
        return $query->where('site_id', $siteId);
    }

    public function scopeByType($query, $typeId)
    {
        return $query->where('resource_type_id', $typeId);
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }
}
