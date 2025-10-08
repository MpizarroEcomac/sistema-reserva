<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'resource_id',
        'booking_code',
        'start_at',
        'end_at',
        'status',
        'purpose',
        'attendees',
        'license_plate',
        'notes',
        'metadata',
        'created_by',
        'cancelled_at',
        'cancelled_by',
        'cancellation_reason',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'metadata' => 'array',
        'attendees' => 'integer',
    ];

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['confirmed', 'completed']);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>', now())
                    ->where('status', 'confirmed');
    }

    public function scopeByResource($query, $resourceId)
    {
        return $query->where('resource_id', $resourceId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOverlapping($query, $startAt, $endAt, $excludeId = null)
    {
        $query = $query->where(function ($q) use ($startAt, $endAt) {
            $q->where(function ($subQ) use ($startAt, $endAt) {
                $subQ->where('start_at', '<', $endAt)
                     ->where('end_at', '>', $startAt);
            });
        })->whereIn('status', ['confirmed', 'completed']);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query;
    }

    // Métodos de utilidad
    public function getDurationInMinutes(): int
    {
        return $this->start_at->diffInMinutes($this->end_at);
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['confirmed', 'completed']);
    }

    public function canBeCancelled(): bool
    {
        return $this->status === 'confirmed' && $this->start_at > now();
    }

    public function isUpcoming(): bool
    {
        return $this->start_at > now() && $this->status === 'confirmed';
    }

    // Generación automática de código de reserva
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_code)) {
                $booking->booking_code = static::generateBookingCode();
            }
        });
    }

    public static function generateBookingCode(): string
    {
        do {
            $code = 'BOOK-' . date('Y') . '-' . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::where('booking_code', $code)->exists());

        return $code;
    }
}
