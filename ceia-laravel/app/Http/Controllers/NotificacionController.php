<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notificacion;

class NotificacionController extends Controller
{
    // Obtener todas las notificaciones
    public function index()
    {
        return response()->json(Notificacion::all());
    }

    // Crear una nueva notificación
    public function store(Request $request)
    {
        $notificacion = Notificacion::create($request->all());
        return response()->json($notificacion, 201);
    }

    // Obtener una notificación específica por su ID
    public function show($id)
    {
        return response()->json(Notificacion::findOrFail($id));
    }

    // Actualizar una notificación existente
    public function update(Request $request, $id)
    {
        $notificacion = Notificacion::findOrFail($id);
        $notificacion->update($request->all());
        return response()->json($notificacion, 200);
    }

    // Eliminar una notificación
    public function destroy($id)
    {
        Notificacion::destroy($id);
        return response()->json(null, 204);
    }

    // Marcar una notificación como leída
    public function marcarComoLeida($id)
    {
        $notificacion = Notificacion::findOrFail($id);
        $notificacion->marcarComoLeida();
        return response()->json($notificacion, 200);
    }

    // Obtener notificaciones no leídas
    public function noLeidas()
    {
        return response()->json(Notificacion::noLeidas()->get());
    }

    // Filtrar notificaciones por tipo
    public function filtrarPorTipo($tipo)
    {
        return response()->json(Notificacion::tipo($tipo)->get());
    }
}
