<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialMantenimiento extends Model
{
    use HasFactory;

    protected $table = 'historial_mantenimientos';
    protected $primaryKey = 'IdHistorial';

    protected $fillable = [
        'FechaMantenimiento',
        'DescripcionTrabajo',
        'TipoTrabajo',
        'IdEquipo',
        'IdSolicitud',
    ];

    public function equipo()
    {
        return $this->belongsTo(Equipo::class, 'IdEquipo', 'IdEquipo');
    }

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'IdSolicitud', 'IdSolicitud');
    }
}