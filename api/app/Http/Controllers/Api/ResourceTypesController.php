<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResourceType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class ResourceTypesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of resource types
     */
    public function index(Request $request)
    {
        $request->validate([
            'active' => 'nullable|boolean',
            'with_resources_count' => 'nullable|boolean',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $query = ResourceType::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        } else {
            $query->active();
        }

        // Include resources count if requested
        if ($request->boolean('with_resources_count')) {
            $query->withCount(['resources' => function ($q) {
                $q->active();
            }]);
        }

        if ($request->has('per_page')) {
            $perPage = $request->get('per_page');
            $resourceTypes = $query->orderBy('name')->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'resource_types' => $resourceTypes->items(),
                    'pagination' => [
                        'current_page' => $resourceTypes->currentPage(),
                        'per_page' => $resourceTypes->perPage(),
                        'total' => $resourceTypes->total(),
                        'last_page' => $resourceTypes->lastPage(),
                        'from' => $resourceTypes->firstItem(),
                        'to' => $resourceTypes->lastItem(),
                    ]
                ]
            ]);
        } else {
            $resourceTypes = $query->orderBy('name')->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'resource_types' => $resourceTypes
                ]
            ]);
        }
    }

    /**
     * Store a newly created resource type
     */
    public function store(Request $request)
    {
        Gate::authorize('create', ResourceType::class);

        $request->validate([
            'code' => 'required|string|max:50|unique:resource_types',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
            'default_attributes' => 'nullable|array',
        ]);

        $resourceType = ResourceType::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tipo de recurso creado exitosamente',
            'data' => [
                'resource_type' => $resourceType
            ]
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource type
     */
    public function show(Request $request, ResourceType $resourceType)
    {
        // Include resources if requested
        if ($request->boolean('with_resources')) {
            $resourceType->load(['resources' => function ($query) {
                $query->active()->with('site:id,code,name');
            }]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'resource_type' => $resourceType
            ]
        ]);
    }

    /**
     * Update the specified resource type
     */
    public function update(Request $request, ResourceType $resourceType)
    {
        Gate::authorize('update', $resourceType);

        $request->validate([
            'code' => 'string|max:50|unique:resource_types,code,' . $resourceType->id,
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-F]{6}$/i',
            'default_attributes' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $resourceType->update($request->only([
            'code', 'name', 'description', 'icon', 'color',
            'default_attributes', 'is_active'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Tipo de recurso actualizado exitosamente',
            'data' => [
                'resource_type' => $resourceType
            ]
        ]);
    }

    /**
     * Remove the specified resource type
     */
    public function destroy(ResourceType $resourceType)
    {
        Gate::authorize('delete', $resourceType);

        // Check if there are resources of this type
        $resourcesCount = $resourceType->resources()->count();
        if ($resourcesCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar el tipo de recurso porque tiene recursos asociados',
                'errors' => [
                    'resource_type' => ['Existen ' . $resourcesCount . ' recursos de este tipo']
                ]
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $resourceType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tipo de recurso eliminado exitosamente'
        ]);
    }
}
