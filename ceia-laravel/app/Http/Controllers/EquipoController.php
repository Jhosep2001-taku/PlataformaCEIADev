<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipo;

class EquipoController extends Controller
{
    // Obtener todos los equipos
    public function index()
    {
        return Equipo::all();
    }

    // Crear un nuevo equipo
    public function store(Request $request)
    {
        $equipo = Equipo::create($request->all());
        return response()->json($equipo, 201);
    }

    // Obtener un equipo específico por su ID
    public function show($id)
    {
        return Equipo::findOrFail($id);
    }

    // Actualizar un equipo existente
    public function update(Request $request, $id)
    {
        $equipo = Equipo::findOrFail($id);
        $equipo->update($request->all());
        return response()->json($equipo, 200);
    }

    // Eliminar un equipo
    public function destroy($id)
    {
        Equipo::destroy($id);
        return response()->json(null, 204);
    }
}
