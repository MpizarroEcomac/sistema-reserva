<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class SitesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of sites
     */
    public function index(Request $request)
    {
        $query = Site::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        } else {
            $query->active(); // Default to active sites only
        }

        // Filter by code
        if ($request->filled('code')) {
            $query->where('code', 'like', '%' . $request->code . '%');
        }

        // Include counts if requested
        if ($request->boolean('with_counts')) {
            $query->withCount(['resources', 'users']);
        }

        // Include resources if requested
        if ($request->boolean('with_resources')) {
            $query->with('resources:id,site_id,code,name,resource_type_id');
        }

        $sites = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'sites' => $sites->map(function ($site) {
                    return [
                        'id' => $site->id,
                        'code' => $site->code,
                        'name' => $site->name,
                        'address' => $site->address,
                        'timezone' => $site->timezone,
                        'operating_hours' => $site->operating_hours,
                        'is_active' => $site->is_active,
                        'description' => $site->description,
                        'metadata' => $site->metadata,
                        'resources_count' => $site->resources_count ?? null,
                        'users_count' => $site->users_count ?? null,
                        'resources' => $site->resources ?? null,
                        'created_at' => $site->created_at,
                        'updated_at' => $site->updated_at,
                    ];
                })
            ],
            'meta' => [
                'total' => $sites->count()
            ]
        ]);
    }

    /**
     * Store a newly created site
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Site::class);

        $request->validate([
            'code' => 'required|string|max:10|unique:sites,code',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'timezone' => 'string|max:50',
            'operating_hours' => 'nullable|array',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $site = Site::create($request->only([
            'code', 'name', 'address', 'timezone', 
            'operating_hours', 'description', 'metadata'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Sede creada exitosamente',
            'data' => [
                'site' => $site
            ]
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified site
     */
    public function show(Request $request, Site $site)
    {
        // Load relationships if requested
        $with = [];
        if ($request->boolean('with_resources')) {
            $with[] = 'resources.resourceType';
        }
        if ($request->boolean('with_rule_sets')) {
            $with[] = 'ruleSets.resourceType';
        }
        if ($request->boolean('with_users')) {
            $with[] = 'users:id,name,email,role,site_id';
        }

        if (!empty($with)) {
            $site->load($with);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'site' => [
                    'id' => $site->id,
                    'code' => $site->code,
                    'name' => $site->name,
                    'address' => $site->address,
                    'timezone' => $site->timezone,
                    'operating_hours' => $site->operating_hours,
                    'is_active' => $site->is_active,
                    'description' => $site->description,
                    'metadata' => $site->metadata,
                    'resources' => $site->resources ?? null,
                    'rule_sets' => $site->ruleSets ?? null,
                    'users' => $site->users ?? null,
                    'created_at' => $site->created_at,
                    'updated_at' => $site->updated_at,
                ]
            ]
        ]);
    }

    /**
     * Update the specified site
     */
    public function update(Request $request, Site $site)
    {
        Gate::authorize('update', $site);

        $request->validate([
            'code' => 'string|max:10|unique:sites,code,' . $site->id,
            'name' => 'string|max:255',
            'address' => 'nullable|string',
            'timezone' => 'string|max:50',
            'operating_hours' => 'nullable|array',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $site->update($request->only([
            'code', 'name', 'address', 'timezone', 'operating_hours',
            'is_active', 'description', 'metadata'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Sede actualizada exitosamente',
            'data' => [
                'site' => $site
            ]
        ]);
    }

    /**
     * Remove the specified site
     */
    public function destroy(Site $site)
    {
        Gate::authorize('delete', $site);

        // Check if site has active resources or bookings
        $activeResourcesCount = $site->resources()->active()->count();
        if ($activeResourcesCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar la sede porque tiene recursos activos',
                'errors' => [
                    'site' => ['La sede tiene ' . $activeResourcesCount . ' recursos activos']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $site->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sede eliminada exitosamente'
        ]);
    }

    /**
     * Get availability summary for a site
     */
    public function availability(Request $request, Site $site)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'type' => 'nullable|string|exists:resource_types,code'
        ]);

        $date = $request->date;
        $resourceType = $request->type;

        $query = $site->resources()->active();
        
        if ($resourceType) {
            $query->whereHas('resourceType', function ($q) use ($resourceType) {
                $q->where('code', $resourceType);
            });
        }

        $resources = $query->with('resourceType')->get();

        $availability = $resources->map(function ($resource) use ($date) {
            $bookings = $resource->bookings()
                ->whereDate('start_at', $date)
                ->active()
                ->orderBy('start_at')
                ->get(['start_at', 'end_at']);

            return [
                'resource_id' => $resource->id,
                'resource_code' => $resource->code,
                'resource_name' => $resource->name,
                'resource_type' => $resource->resourceType->name,
                'is_available' => $bookings->isEmpty(),
                'bookings_count' => $bookings->count(),
                'occupied_slots' => $bookings->map(function ($booking) {
                    return [
                        'start' => $booking->start_at->format('H:i'),
                        'end' => $booking->end_at->format('H:i')
                    ];
                })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'site' => [
                    'id' => $site->id,
                    'code' => $site->code,
                    'name' => $site->name
                ],
                'date' => $date,
                'resource_type' => $resourceType,
                'availability' => $availability,
                'summary' => [
                    'total_resources' => $availability->count(),
                    'available_resources' => $availability->where('is_available', true)->count(),
                    'occupied_resources' => $availability->where('is_available', false)->count()
                ]
            ]
        ]);
    }
}
