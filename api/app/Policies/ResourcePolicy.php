<?php

namespace App\Policies;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ResourcePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view resources list
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Resource $resource): bool
    {
        // Super admin can view all resources
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin, reception can view resources from their site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $resource->site_id) {
            return true;
        }
        
        // Users can view resources from their assigned site
        if ($user->site_id == $resource->site_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Super admin can create resources in any site
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin can create resources in their site
        if ($user->isSiteAdmin()) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Resource $resource): bool
    {
        // Super admin can update any resource
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin can update resources from their site
        if ($user->isSiteAdmin() && $user->site_id == $resource->site_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Resource $resource): bool
    {
        // Super admin can delete any resource
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin can delete resources from their site
        if ($user->isSiteAdmin() && $user->site_id == $resource->site_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Resource $resource): bool
    {
        // Same as update permissions
        return $this->update($user, $resource);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Resource $resource): bool
    {
        // Only super admin can force delete resources
        return $user->isSuperAdmin();
    }
}
