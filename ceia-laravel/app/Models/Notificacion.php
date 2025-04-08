<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'IdUsuario',
        'tipo',
        'mensaje',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'fecha_recordatorio'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'fecha_recordatorio' => 'date',
        'fecha_creacion' => 'datetime',
    ];

    /**
     * Obtiene el usuario asociado a esta notificación.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'IdUsuario', 'IdUsuario');
    }

    /**
     * Scope para filtrar notificaciones no leídas.
     */
    public function scopeNoLeidas($query)
    {
        return $query->where('estado', 'No leído');
    }

    /**
     * Scope para filtrar por tipo de notificación.
     */
    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Marca la notificación como leída.
     */
    public function marcarComoLeida()
    {
        $this->estado = 'Leído';
        $this->save();
    }
}