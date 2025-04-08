<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validar la solicitud
        $request->validate([
            'Correo' => 'required|email',
            'Clave' => 'required|string',
        ]);

        // Obtener las credenciales
        $credentials = $request->only('Correo', 'Clave');

        // Buscar el usuario por correo
        $usuario = Usuario::where('Correo', $credentials['Correo'])->first();

        // Verificar la contraseña
        if ($usuario && Hash::check($credentials['Clave'], $usuario->Clave)) {
            // Crear el token
            $token = $usuario->createToken('auth_token')->plainTextToken;

            // Obtener los permisos del usuario
            $permisos = $usuario->permisos->pluck('TipoPermiso');

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'TipoPermiso' => $permisos,
                'IdUsuario' => $usuario->IdUsuario,  // Agregar el ID del usuario aquí
            ]);
        }

        // Responder con error si las credenciales son inválidas
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    public function logout(Request $request)
    {
        // Revocar el token que se usó para autenticar la solicitud actual
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }
}
