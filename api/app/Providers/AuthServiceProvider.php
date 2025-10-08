<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Site;
use App\Models\Resource;
use App\Models\ResourceType;
use App\Models\Booking;
use App\Policies\SitePolicy;
use App\Policies\ResourcePolicy;
use App\Policies\ResourceTypePolicy;
use App\Policies\BookingPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Site::class => SitePolicy::class,
        Resource::class => ResourcePolicy::class,
        ResourceType::class => ResourceTypePolicy::class,
        Booking::class => BookingPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
