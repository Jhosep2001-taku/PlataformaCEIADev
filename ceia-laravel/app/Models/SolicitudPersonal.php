<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SolicitudPersonal extends Pivot
{
    use HasFactory;

    protected $table = 'solicitud_personal';

    public $incrementing = true;

    protected $fillable = ['IdSolicitud', 'IdUsuario'];

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'IdSolicitud', 'IdSolicitud');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'IdUsuario', 'IdUsuario');
    }
}