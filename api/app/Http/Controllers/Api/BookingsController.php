<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of bookings with filters
     */
    public function index(Request $request)
    {
        $request->validate([
            'site' => 'nullable|string|exists:sites,code',
            'resource_code' => 'nullable|string',
            'resource_type' => 'nullable|string|exists:resource_types,code',
            'status' => 'nullable|in:confirmed,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'user_id' => 'nullable|integer|exists:users,id',
            'my_bookings' => 'nullable|boolean',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = Booking::with([
            'user:id,name,email',
            'resource.site:id,code,name',
            'resource.resourceType:id,code,name,icon'
        ]);

        // Filter by my bookings
        if ($request->boolean('my_bookings')) {
            $query->where('user_id', auth()->id());
        } elseif ($request->filled('user_id') && auth()->user()->canViewOtherUserBookings()) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by site
        if ($request->filled('site')) {
            $query->whereHas('resource.site', function ($q) use ($request) {
                $q->where('code', $request->site);
            });
        }

        // Filter by resource code
        if ($request->filled('resource_code')) {
            $query->whereHas('resource', function ($q) use ($request) {
                $q->where('code', 'like', '%' . $request->resource_code . '%');
            });
        }

        // Filter by resource type
        if ($request->filled('resource_type')) {
            $query->whereHas('resource.resourceType', function ($q) use ($request) {
                $q->where('code', $request->resource_type);
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->active(); // Only active bookings by default
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('start_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('start_at', '<=', $request->end_date);
        }

        // Default date range if none specified
        if (!$request->filled('start_date') && !$request->filled('end_date')) {
            $query->where('start_at', '>=', now());
        }

        $perPage = $request->get('per_page', 20);
        $bookings = $query->orderBy('start_at')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'bookings' => $bookings->items(),
                'pagination' => [
                    'current_page' => $bookings->currentPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                    'last_page' => $bookings->lastPage(),
                    'from' => $bookings->firstItem(),
                    'to' => $bookings->lastItem(),
                ]
            ],
            'filters_applied' => [
                'site' => $request->site,
                'resource_code' => $request->resource_code,
                'resource_type' => $request->resource_type,
                'status' => $request->status,
                'date_range' => [
                    'start' => $request->start_date,
                    'end' => $request->end_date
                ],
                'my_bookings' => $request->boolean('my_bookings')
            ]
        ]);
    }

    /**
     * Store a newly created booking
     */
    public function store(Request $request)
    {
        $request->validate([
            'resource_id' => 'required|integer|exists:resources,id',
            'start_at' => 'required|date|after:now',
            'end_at' => 'required|date|after:start_at',
            'purpose' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'attendees' => 'nullable|integer|min:1',
            'license_plate' => 'nullable|string|max:20',
            'metadata' => 'nullable|array',
        ]);

        $resource = Resource::with(['site', 'resourceType'])->findOrFail($request->resource_id);
        
        // Check if resource is active
        if (!$resource->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'El recurso no está disponible para reservas',
                'errors' => [
                    'resource' => ['El recurso está desactivado']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Authorization check
        Gate::authorize('create', [Booking::class, $resource]);

        $startAt = Carbon::parse($request->start_at);
        $endAt = Carbon::parse($request->end_at);

        // Validate capacity if specified
        if ($resource->capacity && $request->attendees > $resource->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'La cantidad de asistentes excede la capacidad del recurso',
                'errors' => [
                    'attendees' => [
                        'Máximo ' . $resource->capacity . ' personas, solicitaste ' . $request->attendees
                    ]
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check for conflicts
        $conflictingBookings = Booking::where('resource_id', $resource->id)
            ->active()
            ->where(function ($query) use ($startAt, $endAt) {
                $query->where('start_at', '<', $endAt)
                      ->where('end_at', '>', $startAt);
            })
            ->exists();

        if ($conflictingBookings) {
            return response()->json([
                'success' => false,
                'message' => 'El recurso no está disponible en el horario solicitado',
                'errors' => [
                    'schedule' => ['Existe una reserva que se superpone con el horario solicitado']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // TODO: Apply business rules from RuleSet (time restrictions, advance booking, etc.)
        // This would be enhanced with the RuleSet logic

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => auth()->id(),
                'resource_id' => $resource->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'purpose' => $request->purpose,
                'notes' => $request->notes,
                'attendees' => $request->attendees ?? 1,
                'license_plate' => $request->license_plate,
                'metadata' => $request->metadata ?? [],
                'status' => 'confirmed',
                'created_by' => auth()->id(),
            ]);

            $booking->load(['user:id,name,email', 'resource.site', 'resource.resourceType']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Reserva creada exitosamente',
                'data' => [
                    'booking' => $booking
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la reserva',
                'errors' => [
                    'general' => ['Ocurrió un error interno. Por favor intenta de nuevo.']
                ]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified booking
     */
    public function show(Booking $booking)
    {
        Gate::authorize('view', $booking);

        $booking->load([
            'user:id,name,email',
            'resource.site',
            'resource.resourceType'
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'booking' => $booking
            ]
        ]);
    }

    /**
     * Update the specified booking
     */
    public function update(Request $request, Booking $booking)
    {
        Gate::authorize('update', $booking);

        // Only allow updates to future bookings
        if ($booking->start_at <= now()) {
            return response()->json([
                'success' => false,
                'message' => 'No se pueden modificar reservas que ya han comenzado',
                'errors' => [
                    'booking' => ['Solo se pueden modificar reservas futuras']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $request->validate([
            'start_at' => 'date|after:now',
            'end_at' => 'date|after:start_at',
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'attendees_count' => 'nullable|integer|min:1',
            'additional_data' => 'nullable|array',
        ]);

        $updateData = $request->only([
            'title', 'description', 'attendees_count', 'additional_data'
        ]);

        // If changing schedule, check for conflicts
        if ($request->filled('start_at') || $request->filled('end_at')) {
            $startAt = $request->filled('start_at') 
                ? Carbon::parse($request->start_at) 
                : $booking->start_at;
            $endAt = $request->filled('end_at') 
                ? Carbon::parse($request->end_at) 
                : $booking->end_at;

            // Check capacity
            if ($booking->resource->capacity && $request->get('attendees_count', $booking->attendees_count) > $booking->resource->capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'La cantidad de asistentes excede la capacidad del recurso',
                    'errors' => [
                        'attendees_count' => [
                            'Máximo ' . $booking->resource->capacity . ' personas'
                        ]
                    ]
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Check for conflicts (excluding this booking)
            $conflictingBookings = Booking::where('resource_id', $booking->resource_id)
                ->where('id', '!=', $booking->id)
                ->active()
                ->where(function ($query) use ($startAt, $endAt) {
                    $query->where('start_at', '<', $endAt)
                          ->where('end_at', '>', $startAt);
                })
                ->exists();

            if ($conflictingBookings) {
                return response()->json([
                    'success' => false,
                    'message' => 'El recurso no está disponible en el horario solicitado',
                    'errors' => [
                        'schedule' => ['Existe una reserva que se superpone con el horario solicitado']
                    ]
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $updateData['start_at'] = $startAt;
            $updateData['end_at'] = $endAt;
        }

        $booking->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Reserva actualizada exitosamente',
            'data' => [
                'booking' => $booking
            ]
        ]);
    }

    /**
     * Cancel the specified booking
     */
    public function destroy(Booking $booking)
    {
        Gate::authorize('delete', $booking);

        // Soft delete - mark as cancelled instead of hard delete
        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancelled_by' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva cancelada exitosamente'
        ]);
    }

    /**
     * Restore a cancelled booking
     */
    public function restore(Booking $booking)
    {
        Gate::authorize('update', $booking);

        if ($booking->status !== 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden restaurar reservas canceladas',
                'errors' => [
                    'booking' => ['La reserva no está cancelada']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check if the booking is still in the future
        if ($booking->start_at <= now()) {
            return response()->json([
                'success' => false,
                'message' => 'No se pueden restaurar reservas pasadas',
                'errors' => [
                    'booking' => ['La reserva ya ha comenzado o finalizó']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Check for conflicts again
        $conflictingBookings = Booking::where('resource_id', $booking->resource_id)
            ->where('id', '!=', $booking->id)
            ->active()
            ->where(function ($query) use ($booking) {
                $query->where('start_at', '<', $booking->end_at)
                      ->where('end_at', '>', $booking->start_at);
            })
            ->exists();

        if ($conflictingBookings) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede restaurar la reserva porque el horario ya no está disponible',
                'errors' => [
                    'schedule' => ['Existe otra reserva en el mismo horario']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $booking->update([
            'status' => 'confirmed',
            'cancelled_at' => null,
            'cancelled_by' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva restaurada exitosamente',
            'data' => [
                'booking' => $booking
            ]
        ]);
    }
}
