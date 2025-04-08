<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    // Obtener todos los usuarios
    public function index()
    {
        return Usuario::all();
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $data = $request->all();
    
        // Hashear la contraseña si está presente
        if (isset($data['Clave'])) {
            $data['Clave'] = Hash::make($data['Clave']);
        }
    
        $usuario = Usuario::create($data);
        return response()->json($usuario, 201);
    }

    // Obtener un usuario específico por su ID
    public function show($id)
    {
        return Usuario::findOrFail($id);
    }

    // Actualizar un usuario existente
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        
        $data = $request->all();
        
        // Si se proporciona una nueva contraseña, hashearla
        if (isset($data['Clave'])) {
            $data['Clave'] = Hash::make($data['Clave']);
        } else {
            // Si no se proporciona una nueva contraseña, eliminarla del array
            // para no sobrescribir la contraseña existente
            unset($data['Clave']);
        }

        $usuario->update($data);
        return response()->json($usuario, 200);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        Usuario::destroy($id);
        return response()->json(null, 204);
    }

    public function updateProfile(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);
        
        $data = $request->all();
        
        // Debugging
        \Log::info('Datos recibidos para actualizar perfil:', $data);
    
        if (isset($data['Clave'])) {
            $data['Clave'] = Hash::make($data['Clave']);
        } else {
            unset($data['Clave']);
        }
    
        $usuario->update($data);
        return response()->json($usuario, 200);
    }
    

}
