<?php

namespace App\Policies;

use App\Models\Site;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SitePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view sites list
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Site $site): bool
    {
        // Super admin can view all sites
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin, reception can view their assigned site
        if ($user->hasAnyRole(['site_admin', 'reception']) && $user->site_id == $site->id) {
            return true;
        }
        
        // Users can view their assigned site
        if ($user->site_id == $site->id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only super admin can create sites
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Site $site): bool
    {
        // Super admin can update any site
        if ($user->isSuperAdmin()) {
            return true;
        }
        
        // Site admin can update their assigned site
        if ($user->isSiteAdmin() && $user->site_id == $site->id) {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Site $site): bool
    {
        // Only super admin can delete sites
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Site $site): bool
    {
        // Only super admin can restore sites
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Site $site): bool
    {
        // Only super admin can force delete sites
        return $user->isSuperAdmin();
    }
}
