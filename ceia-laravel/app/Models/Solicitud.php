<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;

    protected $table = 'solicitudes';
    protected $primaryKey = 'IdSolicitud';

    protected $fillable = [
        'Descripcion',
        'Unidad',
        'Estado',
        'FechaInicio',
        'FechaFin',
        'Prioridad',
        'TipoTrabajo',
    ];

    public function historialesMantenimiento()
    {
        return $this->hasMany(HistorialMantenimiento::class, 'IdSolicitud', 'IdSolicitud');
    }

    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'IdSolicitud', 'IdSolicitud');
    }
    // Relación con el modelo Imagen si es necesario
    public function imagenes()
    {
        return $this->hasMany(Imagen::class, 'IdSolicitud', 'IdSolicitud');
    }
    
}