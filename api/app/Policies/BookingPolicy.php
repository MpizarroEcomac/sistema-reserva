<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view bookings list (filtered by their permissions)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Super admin can view all bookings
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin and reception can view bookings from their site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $booking->resource->site_id) {
            return true;
        }
        
        // Users can view their own bookings
        if ($user->id == $booking->user_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Resource $resource = null): bool
    {
        // Super admin can create bookings anywhere
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin and reception can create bookings for resources in their site
        if ($resource && $user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $resource->site_id) {
            return true;
        }
        
        // Users can create bookings for resources in their assigned site
        if ($resource && $user->site_id == $resource->site_id) {
            return true;
        }
        
        // If no resource specified, allow if user has a site assigned (will be validated later)
        if (!$resource && $user->site_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Super admin can update all bookings
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin and reception can update bookings from their site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $booking->resource->site_id) {
            return true;
        }
        
        // Users can update their own bookings (with time restrictions handled in controller)
        if ($user->id == $booking->user_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model (cancel).
     */
    public function delete(User $user, Booking $booking): bool
    {
        // Super admin can cancel all bookings
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin and reception can cancel bookings from their site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $booking->resource->site_id) {
            return true;
        }
        
        // Users can cancel their own bookings
        if ($user->id == $booking->user_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Booking $booking): bool
    {
        // Super admin can restore all bookings
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin and reception can restore bookings from their site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $booking->resource->site_id) {
            return true;
        }
        
        // Users can restore their own bookings (with time restrictions handled in controller)
        if ($user->id == $booking->user_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Booking $booking): bool
    {
        // Only super admin and site admin can permanently delete bookings
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        if ($user->isSiteAdmin() && $user->site_id == $booking->resource->site_id) {
            return true;
        }
        
        return false;
    }
}
