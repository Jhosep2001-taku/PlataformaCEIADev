<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Permiso;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        // Verificar si ya existe un superadmin para evitar duplicados
        if (Usuario::where('Correo', 'superadmin@domain.com')->exists()) {
            return;
        }

        // Crear el usuario superadmin
        $usuario = Usuario::create([
            'Documento' => '1234567890',
            'NombreCompleto' => 'Super Admin',
            'Correo' => 'superadmin@domain.com',
            'Celular' => '123456789',
            'Clave' => Hash::make('superadmin123'), // Cambiar a una clave segura
            'Rol' => 'Administrador del Sistema',
            'Estado' => true,
        ]);

        // Crear permisos para el usuario
        Permiso::create([
            'IdUsuario' => $usuario->IdUsuario,
            'TipoPermiso' => 'Administrador del Sistema',
        ]);
    }
}
