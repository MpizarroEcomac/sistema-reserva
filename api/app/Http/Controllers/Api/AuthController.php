<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean'
        ]);

        $user = User::active()
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas'],
            ]);
        }

        // Update last login
        $user->update([
            'last_login_at' => now()
        ]);

        // Create token
        $tokenName = $request->get('device_name', 'web-session');
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'site_id' => $user->site_id,
                    'site' => $user->site ? [
                        'id' => $user->site->id,
                        'code' => $user->site->code,
                        'name' => $user->site->name
                    ] : null,
                    'department' => $user->department,
                    'mfa_enabled' => $user->mfa_enabled,
                    'permissions' => $this->getUserPermissions($user)
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    /**
     * Logout user (revoke current token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout exitoso'
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout de todos los dispositivos exitoso'
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('site');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'site_id' => $user->site_id,
                    'site' => $user->site ? [
                        'id' => $user->site->id,
                        'code' => $user->site->code,
                        'name' => $user->site->name
                    ] : null,
                    'department' => $user->department,
                    'phone' => $user->phone,
                    'employee_id' => $user->employee_id,
                    'mfa_enabled' => $user->mfa_enabled,
                    'last_login_at' => $user->last_login_at,
                    'permissions' => $this->getUserPermissions($user)
                ]
            ]
        ]);
    }

    /**
     * Refresh current token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        $currentToken = $request->user()->currentAccessToken();
        
        // Delete current token
        $currentToken->delete();
        
        // Create new token
        $token = $user->createToken('web-session')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Token renovado',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }

    /**
     * Get user permissions based on role
     */
    private function getUserPermissions(User $user): array
    {
        $basePermissions = ['view_resources', 'create_booking', 'view_own_bookings'];
        
        switch ($user->role) {
            case 'super_admin':
                return array_merge($basePermissions, [
                    'manage_all_sites', 'manage_all_users', 'manage_all_bookings',
                    'view_reports', 'manage_resources', 'manage_rules'
                ]);
                
            case 'site_admin':
                return array_merge($basePermissions, [
                    'manage_site_users', 'manage_site_bookings', 'manage_site_resources',
                    'view_site_reports', 'manage_site_rules'
                ]);
                
            case 'reception':
                return array_merge($basePermissions, [
                    'create_booking_for_others', 'view_site_bookings', 'manage_walk_ins'
                ]);
                
            default: // user
                return $basePermissions;
        }
    }
}
