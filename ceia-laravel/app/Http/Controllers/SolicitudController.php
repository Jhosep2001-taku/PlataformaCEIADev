<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Solicitud;

class SolicitudController extends Controller
{
    // Obtener todas las solicitudes
    public function index()
    {
        return response()->json(Solicitud::all());
    }

    // Crear una nueva solicitud
    public function store(Request $request)
    {
        $solicitud = Solicitud::create($request->all());
        return response()->json($solicitud, 201);
    }

    // Obtener una solicitud específica por su ID
    public function show($id)
    {
        return response()->json(Solicitud::findOrFail($id));
    }

    // Actualizar una solicitud existente
    public function update(Request $request, $id)
    {
        $solicitud = Solicitud::findOrFail($id);
        $solicitud->update($request->all());
        return response()->json($solicitud, 200);
    }

    // Eliminar una solicitud
    public function destroy($id)
    {
        Solicitud::destroy($id);
        return response()->json(null, 204);
    }
}
