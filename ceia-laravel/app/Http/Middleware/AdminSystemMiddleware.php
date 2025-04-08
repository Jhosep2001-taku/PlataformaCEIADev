<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminSystemMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $usuario = $request->user();

        if (!$usuario || !$usuario->permisos->contains('TipoPermiso', 'Administrador del Sistema')) {
            return response()->json(['message' => 'Acceso no autorizado'], 403);
        }

        return $next($request);
    }
}