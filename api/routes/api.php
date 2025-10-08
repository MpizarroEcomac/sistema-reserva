<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SitesController;
use App\Http\Controllers\Api\ResourceTypesController;
use App\Http\Controllers\Api\ResourcesController;
use App\Http\Controllers\Api\BookingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes (public)
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes (authenticated)
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // User info route
    Route::get('/user', function (Request $request) {
        return $request->user()->load('site:id,code,name');
    });
    
    // Sites routes
    Route::apiResource('sites', SitesController::class);
    Route::get('/sites/{site}/availability', [SitesController::class, 'availability']);
    
    // Resource Types routes
    Route::apiResource('resource-types', ResourceTypesController::class);
    
    // Resources routes
    Route::apiResource('resources', ResourcesController::class);
    Route::get('/resources/{resource}/availability', [ResourcesController::class, 'availability']);
    
    // Bookings routes
    Route::apiResource('bookings', BookingsController::class);
    Route::post('/bookings/{booking}/restore', [BookingsController::class, 'restore']);
    
});
