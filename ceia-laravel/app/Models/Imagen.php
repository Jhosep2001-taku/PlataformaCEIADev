<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $table = 'imagenes';
    protected $primaryKey = 'IdImagen';
    public $timestamps = true; // Asegúrate de que esto esté establecido correctamente

    protected $fillable = [
        'IdEquipo', 
        'IdSolicitud',
        'Ruta'
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