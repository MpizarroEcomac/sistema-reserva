<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Site;
use App\Models\ResourceType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class ResourcesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of resources with advanced filters
     */
    public function index(Request $request)
    {
        $request->validate([
            'site' => 'nullable|string|exists:sites,code',
            'site_id' => 'nullable|integer|exists:sites,id',
            'type' => 'nullable|string|exists:resource_types,code',
            'type_id' => 'nullable|integer|exists:resource_types,id',
            'capacity_min' => 'nullable|integer|min:1',
            'capacity_max' => 'nullable|integer|min:1',
            'location' => 'nullable|string',
            'tags' => 'nullable|array',
            'equipment' => 'nullable|array',
            'active' => 'nullable|boolean',
            'available_on' => 'nullable|date|after_or_equal:today',
            'available_from' => 'nullable|date_format:H:i',
            'available_to' => 'nullable|date_format:H:i',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Resource::with(['site:id,code,name', 'resourceType:id,code,name,icon']);

        // Filter by site
        if ($request->filled('site')) {
            $query->whereHas('site', function ($q) use ($request) {
                $q->where('code', $request->site);
            });
        } elseif ($request->filled('site_id')) {
            $query->where('site_id', $request->site_id);
        }

        // Filter by resource type
        if ($request->filled('type')) {
            $query->whereHas('resourceType', function ($q) use ($request) {
                $q->where('code', $request->type);
            });
        } elseif ($request->filled('type_id')) {
            $query->where('resource_type_id', $request->type_id);
        }

        // Filter by capacity
        if ($request->filled('capacity_min')) {
            $query->where('capacity', '>=', $request->capacity_min);
        }
        if ($request->filled('capacity_max')) {
            $query->where('capacity', '<=', $request->capacity_max);
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // Filter by tags
        if ($request->filled('tags')) {
            foreach ($request->tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        // Filter by equipment
        if ($request->filled('equipment')) {
            foreach ($request->equipment as $equipment) {
                $query->whereJsonContains('equipment', $equipment);
            }
        }

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        } else {
            $query->active();
        }

        // Filter by availability on specific date/time
        if ($request->filled('available_on')) {
            $date = $request->available_on;
            $from = $request->get('available_from', '00:00');
            $to = $request->get('available_to', '23:59');
            
            $startDateTime = Carbon::parse($date . ' ' . $from);
            $endDateTime = Carbon::parse($date . ' ' . $to);

            $query->whereDoesntHave('bookings', function ($q) use ($startDateTime, $endDateTime) {
                $q->active()
                  ->where(function ($subQ) use ($startDateTime, $endDateTime) {
                      $subQ->where('start_at', '<', $endDateTime)
                           ->where('end_at', '>', $startDateTime);
                  });
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $resources = $query->orderBy('name')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'resources' => $resources->items(),
                'pagination' => [
                    'current_page' => $resources->currentPage(),
                    'per_page' => $resources->perPage(),
                    'total' => $resources->total(),
                    'last_page' => $resources->lastPage(),
                    'from' => $resources->firstItem(),
                    'to' => $resources->lastItem(),
                ]
            ],
            'filters_applied' => [
                'site' => $request->site,
                'type' => $request->type,
                'capacity_range' => [
                    'min' => $request->capacity_min,
                    'max' => $request->capacity_max
                ],
                'location' => $request->location,
                'available_on' => $request->available_on
            ]
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Resource::class);

        $request->validate([
            'site_id' => 'required|integer|exists:sites,id',
            'resource_type_id' => 'required|integer|exists:resource_types,id',
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'equipment' => 'nullable|array',
            'attributes' => 'nullable|array',
            'location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
        ]);

        // Check unique code per site
        $exists = Resource::where('site_id', $request->site_id)
                          ->where('code', $request->code)
                          ->exists();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'El código del recurso ya existe en esta sede',
                'errors' => [
                    'code' => ['El código debe ser único por sede']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $resource = Resource::create($request->all());
        $resource->load(['site', 'resourceType']);

        return response()->json([
            'success' => true,
            'message' => 'Recurso creado exitosamente',
            'data' => [
                'resource' => $resource
            ]
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource
     */
    public function show(Request $request, Resource $resource)
    {
        // Load relationships
        $resource->load(['site', 'resourceType']);
        
        // Load upcoming bookings if requested
        if ($request->boolean('with_bookings')) {
            $resource->load(['bookings' => function ($query) {
                $query->upcoming()
                      ->with('user:id,name,email')
                      ->orderBy('start_at');
            }]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'resource' => $resource
            ]
        ]);
    }

    /**
     * Update the specified resource
     */
    public function update(Request $request, Resource $resource)
    {
        Gate::authorize('update', $resource);

        $request->validate([
            'code' => 'string|max:50',
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'equipment' => 'nullable|array',
            'attributes' => 'nullable|array',
            'location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        // Check unique code per site if code is being updated
        if ($request->filled('code') && $request->code !== $resource->code) {
            $exists = Resource::where('site_id', $resource->site_id)
                              ->where('code', $request->code)
                              ->where('id', '!=', $resource->id)
                              ->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'El código del recurso ya existe en esta sede',
                    'errors' => [
                        'code' => ['El código debe ser único por sede']
                    ]
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $resource->update($request->only([
            'code', 'name', 'description', 'capacity', 'equipment',
            'attributes', 'location', 'tags', 'is_active'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Recurso actualizado exitosamente',
            'data' => [
                'resource' => $resource
            ]
        ]);
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Resource $resource)
    {
        Gate::authorize('delete', $resource);

        // Check for future bookings
        $futureBookings = $resource->bookings()->upcoming()->count();
        if ($futureBookings > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el recurso porque tiene reservas futuras',
                'errors' => [
                    'resource' => ['El recurso tiene ' . $futureBookings . ' reservas futuras']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $resource->delete();

        return response()->json([
            'success' => true,
            'message' => 'Recurso eliminado exitosamente'
        ]);
    }

    /**
     * Get resource availability for a specific date
     */
    public function availability(Request $request, Resource $resource)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'duration' => 'nullable|integer|min:30|max:600' // minutes
        ]);

        $date = $request->date;
        $duration = $request->get('duration', 60);

        // Get existing bookings for the date
        $bookings = $resource->bookings()
            ->whereDate('start_at', $date)
            ->active()
            ->orderBy('start_at')
            ->get(['start_at', 'end_at']);

        // Get operating hours (simplified - could be enhanced with rule sets)
        $operatingHours = ['08:00', '20:00']; // Default hours
        
        // Find available slots
        $availableSlots = [];
        $startTime = Carbon::parse($date . ' ' . $operatingHours[0]);
        $endTime = Carbon::parse($date . ' ' . $operatingHours[1]);
        
        $currentTime = $startTime->copy();
        
        while ($currentTime->copy()->addMinutes($duration)->lte($endTime)) {
            $slotEnd = $currentTime->copy()->addMinutes($duration);
            
            $isAvailable = !$bookings->contains(function ($booking) use ($currentTime, $slotEnd) {
                return $currentTime->lt($booking->end_at) && $slotEnd->gt($booking->start_at);
            });
            
            if ($isAvailable) {
                $availableSlots[] = [
                    'start' => $currentTime->format('H:i'),
                    'end' => $slotEnd->format('H:i'),
                    'duration_minutes' => $duration
                ];
            }
            
            $currentTime->addMinutes(30); // 30-minute intervals
        }

        return response()->json([
            'success' => true,
            'data' => [
                'resource' => [
                    'id' => $resource->id,
                    'code' => $resource->code,
                    'name' => $resource->name,
                    'site' => $resource->site->name
                ],
                'date' => $date,
                'duration_requested' => $duration,
                'operating_hours' => [
                    'start' => $operatingHours[0],
                    'end' => $operatingHours[1]
                ],
                'occupied_slots' => $bookings->map(function ($booking) {
                    return [
                        'start' => $booking->start_at->format('H:i'),
                        'end' => $booking->end_at->format('H:i')
                    ];
                }),
                'available_slots' => $availableSlots,
                'summary' => [
                    'total_bookings' => $bookings->count(),
                    'available_slots_count' => count($availableSlots),
                    'is_fully_booked' => count($availableSlots) === 0
                ]
            ]
        ]);
    }
}
