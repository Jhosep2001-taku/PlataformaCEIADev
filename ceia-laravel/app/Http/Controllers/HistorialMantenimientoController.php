<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HistorialMantenimiento;

class HistorialMantenimientoController extends Controller
{
    public function index()
    {
        return HistorialMantenimiento::all();
    }

    public function store(Request $request)
    {
        $historial = HistorialMantenimiento::create($request->all());
        return response()->json($historial, 201);
    }

    public function show($id)
    {
        try {
            $historial = HistorialMantenimiento::findOrFail($id);
            return response()->json($historial, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Historial de mantenimiento no encontrado'], 404);
        }
    }
    

    public function update(Request $request, $id)
    {
        $historial = HistorialMantenimiento::findOrFail($id);
        $historial->update($request->all());
        return response()->json($historial, 200);
    }

    public function destroy($id)
    {
        HistorialMantenimiento::destroy($id);
        return response()->json(null, 204);
    }
}