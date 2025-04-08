<?php

namespace App\Http\Controllers;

use App\Models\Imagen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ImagenController extends Controller
{
    // Obtener imágenes de un equipo específico
    public function indexPorEquipo($equipo)
    {
        $imagenes = Imagen::where('IdEquipo', $equipo)->get();
        return response()->json($imagenes);
    }

    // Obtener imágenes de una solicitud específica
    public function indexPorSolicitud($solicitud)
    {
        $imagenes = Imagen::where('IdSolicitud', $solicitud)->get();
        return response()->json($imagenes);
    }

    // Crear una nueva imagen asociada a un equipo
    public function storeForEquipo(Request $request, $equipo)
    {
        $request->validate([
            'Ruta.*' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        $imagenes = $request->file('Ruta');
        $rutaImagenes = [];
    
        foreach ($imagenes as $imagen) {
            $path = $imagen->store('imagenes', 'public');
            $rutaImagenes[] = Imagen::create([
                'IdEquipo' => $equipo,
                'IdSolicitud' => null,  // No aplicable en este caso
                'Ruta' => Storage::url($path),
            ]);
        }
    
        return response()->json($rutaImagenes, 201);
    }

    // Crear una nueva imagen asociada a una solicitud
    public function storeForSolicitud(Request $request, $solicitud)
    {
        $request->validate([
            'Ruta.*' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        $imagenes = $request->file('Ruta');
        $rutaImagenes = [];
    
        foreach ($imagenes as $imagen) {
            $path = $imagen->store('imagenes', 'public');
            $rutaImagenes[] = Imagen::create([
                'IdEquipo' => null,  // No aplicable en este caso
                'IdSolicitud' => $solicitud,
                'Ruta' => Storage::url($path),
            ]);
        }
    
        return response()->json($rutaImagenes, 201);
    }

    // Actualizar una imagen existente
    public function update(Request $request, $imagenId)
    {
        $request->validate([
            'IdEquipo' => 'exists:equipos,IdEquipo',
            'IdSolicitud' => 'exists:solicitudes,IdSolicitud',
            'Ruta' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        $imagen = Imagen::findOrFail($imagenId);
    
        DB::transaction(function () use ($request, $imagen) {
            if ($request->hasFile('Ruta')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagen->Ruta));
                $path = $request->file('Ruta')->store('imagenes', 'public');
                $imagen->update([
                    'Ruta' => Storage::url($path),
                ]);
            }
    
            if ($request->has('IdEquipo')) {
                $imagen->update([
                    'IdEquipo' => $request->input('IdEquipo'),
                ]);
            }
    
            if ($request->has('IdSolicitud')) {
                $imagen->update([
                    'IdSolicitud' => $request->input('IdSolicitud'),
                ]);
            }
        });
    
        return response()->json($imagen, 200);
    }

    // Eliminar una imagen asociada a un equipo
    public function destroyFromEquipo($equipo, $imagenId)
    {
        $imagen = Imagen::where('IdEquipo', $equipo)
                        ->where('IdImagen', $imagenId)
                        ->firstOrFail();
    
        $rutaArchivo = str_replace('/storage/', '', $imagen->Ruta);
    
        if (!Storage::disk('public')->exists($rutaArchivo)) {
            return response()->json(['error' => 'El archivo no existe'], 404);
        }
    
        Storage::disk('public')->delete($rutaArchivo);
        $imagen->delete();
    
        return response()->json(null, 204);
    }

    // Eliminar una imagen asociada a una solicitud
    public function destroyFromSolicitud($solicitud, $imagenId)
    {
        $imagen = Imagen::where('IdSolicitud', $solicitud)
                        ->where('IdImagen', $imagenId)
                        ->firstOrFail();

        $rutaArchivo = str_replace('/storage/', '', $imagen->Ruta);

        if (!Storage::disk('public')->exists($rutaArchivo)) {
            return response()->json(['error' => 'El archivo no existe'], 404);
        }

        Storage::disk('public')->delete($rutaArchivo);
        $imagen->delete();

        return response()->json(null, 204);
    }
}
