<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RuleSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_id',
        'resource_type_id',
        'name',
        'operating_hours',
        'min_duration_minutes',
        'max_duration_minutes',
        'buffer_minutes',
        'max_bookings_per_day',
        'max_advance_days',
        'blocked_days',
        'special_rules',
        'is_active',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'blocked_days' => 'array',
        'special_rules' => 'array',
        'is_active' => 'boolean',
        'min_duration_minutes' => 'integer',
        'max_duration_minutes' => 'integer',
        'buffer_minutes' => 'integer',
        'max_bookings_per_day' => 'integer',
        'max_advance_days' => 'integer',
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

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBySite($query, $siteId)
    {
        return $query->where('site_id', $siteId);
    }

    public function scopeByResourceType($query, $typeId)
    {
        return $query->where('resource_type_id', $typeId);
    }

    // Métodos de validación
    public function validateDuration(int $minutes): bool
    {
        return $minutes >= $this->min_duration_minutes && 
               $minutes <= $this->max_duration_minutes;
    }

    public function validateAdvance(\DateTime $bookingDate): bool
    {
        $daysDiff = (new \DateTime())->diff($bookingDate)->days;
        return $daysDiff <= $this->max_advance_days;
    }

    public function isDayBlocked(\DateTime $date): bool
    {
        $dateStr = $date->format('Y-m-d');
        return in_array($dateStr, $this->blocked_days ?? []);
    }

    public function isTimeInOperatingHours(string $time): bool
    {
        if (empty($this->operating_hours)) {
            return true;
        }

        foreach ($this->operating_hours as $hours) {
            [$start, $end] = explode('-', $hours);
            if ($time >= $start && $time <= $end) {
                return true;
            }
        }

        return false;
    }
}
