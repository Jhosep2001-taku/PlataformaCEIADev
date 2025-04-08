<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\EquipoController;
use App\Http\Controllers\SolicitudController;
use App\Http\Controllers\SolicitudPersonalController;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HistorialMantenimientoController;

// Rutas públicas (no autenticadas)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Rutas para la tabla PERMISO y USUARIO (protegidas por admin.system)
    
        // Rutas para la tabla PERMISO
        Route::get('/permisos', [PermisoController::class, 'index']);
        Route::get('/permisos/{permiso}', [PermisoController::class, 'show']);

        // Rutas para la tabla USUARIO
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);

        Route::put('/usuarios/{usuario}/perfil', [UsuarioController::class, 'updateProfile']);
    Route::middleware('admin.system')->group(function () {
        // Rutas para la tabla PERMISO
        Route::post('/permisos', [PermisoController::class, 'store']);
        Route::put('/permisos/{permiso}', [PermisoController::class, 'update']);
        Route::delete('/permisos/{permiso}', [PermisoController::class, 'destroy']);

        // Rutas para la tabla USUARIO
        Route::post('/usuarios', [UsuarioController::class, 'store']);
        Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
        Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);
    });

    // Rutas para la tabla UNIDAD
    Route::get('/unidades', [UnidadController::class, 'index']);
    Route::post('/unidades', [UnidadController::class, 'store']);
    Route::get('/unidades/{unidad}', [UnidadController::class, 'show']);
    Route::put('/unidades/{unidad}', [UnidadController::class, 'update']);
    Route::delete('/unidades/{unidad}', [UnidadController::class, 'destroy']);

    // Rutas para la tabla EQUIPO
    Route::get('/equipos', [EquipoController::class, 'index']);
    Route::post('/equipos', [EquipoController::class, 'store']);
    Route::get('/equipos/{equipo}', [EquipoController::class, 'show']);
    Route::put('/equipos/{equipo}', [EquipoController::class, 'update']);
    Route::delete('/equipos/{equipo}', [EquipoController::class, 'destroy']);

    // Rutas para la tabla SOLICITUD
    Route::get('/solicitudes', [SolicitudController::class, 'index']);
    Route::post('/solicitudes', [SolicitudController::class, 'store']);
    Route::get('/solicitudes/{solicitud}', [SolicitudController::class, 'show']);
    Route::put('/solicitudes/{solicitud}', [SolicitudController::class, 'update']);
    Route::delete('/solicitudes/{solicitud}', [SolicitudController::class, 'destroy']);

    // Rutas para la tabla SolicitudPersonal
    Route::get('/solicitudPersonal', [SolicitudPersonalController::class, 'index']);
    Route::post('/solicitudPersonal', [SolicitudPersonalController::class, 'store']);
    Route::get('/solicitudPersonal/{solicitudPersonal}', [SolicitudPersonalController::class, 'show']);
    Route::put('/solicitudPersonal/{solicitudPersonal}', [SolicitudPersonalController::class, 'update']);
    Route::delete('/solicitudPersonal/{idSolicitud}/{idUsuario}', [SolicitudPersonalController::class, 'destroy']);

    // Rutas para imágenes asociadas a un equipo
    Route::get('/equipos/{equipo}/imagenes', [ImagenController::class, 'indexPorEquipo']);
    Route::post('/equipos/{equipo}/imagenes', [ImagenController::class, 'storeForEquipo']);
    Route::delete('/equipos/{equipo}/imagenes/{imagenId}', [ImagenController::class, 'destroyFromEquipo']);

    // Rutas para imágenes asociadas a una solicitud
    Route::get('/solicitudes/{solicitud}/imagenes', [ImagenController::class, 'indexPorSolicitud']);
    Route::post('/solicitudes/{solicitud}/imagenes', [ImagenController::class, 'storeForSolicitud']);
    Route::delete('/solicitudes/{solicitud}/imagenes/{imagenId}', [ImagenController::class, 'destroyFromSolicitud']);

    // Rutas para actualizar una imagen (general)
    Route::put('/imagenes/{imagenId}', [ImagenController::class, 'update']);

    // Rutas para HistorialMantenimiento
    Route::get('/mantenimientos', [HistorialMantenimientoController::class, 'index']);
    Route::post('/mantenimientos', [HistorialMantenimientoController::class, 'store']);
    Route::get('/mantenimientos/{mantenimiento}', [HistorialMantenimientoController::class, 'show']);
    Route::put('/mantenimientos/{mantenimiento}', [HistorialMantenimientoController::class, 'update']);
    Route::delete('/mantenimientos/{mantenimiento}', [HistorialMantenimientoController::class, 'destroy']);

});