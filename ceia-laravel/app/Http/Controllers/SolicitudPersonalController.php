<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SolicitudPersonal;

class SolicitudPersonalController extends Controller
{
    // Obtener todas las relaciones de solicitud con personal
    public function index()
    {
        return response()->json(SolicitudPersonal::all());
    }

    // Crear una nueva relación entre solicitud y personal
    public function store(Request $request)
    {
        $solicitudPersonal = SolicitudPersonal::create($request->all());
        return response()->json($solicitudPersonal, 201);
    }

    // Obtener una relación específica entre solicitud y personal
    public function show($id)
    {
        return response()->json(SolicitudPersonal::findOrFail($id));
    }

    // Actualizar una relación existente entre solicitud y personal
    public function update(Request $request, $id)
    {
        $solicitudPersonal = SolicitudPersonal::findOrFail($id);
        $solicitudPersonal->update($request->all());
        return response()->json($solicitudPersonal, 200);
    }

    // Eliminar una relación entre solicitud y personal
    public function destroy(Request $request, $idSolicitud, $idUsuario)
    {
        // Eliminar la relación entre solicitud y personal
        SolicitudPersonal::where('IdSolicitud', $idSolicitud)
                        ->where('IdUsuario', $idUsuario)
                        ->delete();
        
        return response()->json(null, 204);
    }

}
