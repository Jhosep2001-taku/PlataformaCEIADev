<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permiso;

class PermisoController extends Controller
{
    // Obtener todos los permisos
    public function index()
    {
        return Permiso::all();
    }

    // Crear un nuevo permiso
    public function store(Request $request)
    {
        $permiso = Permiso::create($request->all());
        return response()->json($permiso, 201);
    }

    // Obtener un permiso específico por su ID
    public function show($id)
    {
        return Permiso::findOrFail($id);
    }

    // Actualizar un permiso existente
    public function update(Request $request, $id)
    {
        $permiso = Permiso::findOrFail($id);
        $permiso->update($request->all());
        return response()->json($permiso, 200);
    }

    // Eliminar un permiso
    public function destroy($id)
    {
        Permiso::destroy($id);
        return response()->json(null, 204);
    }
}
