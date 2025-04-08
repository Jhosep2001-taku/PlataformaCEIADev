<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    use HasFactory;

    protected $table = 'permiso'; // Nombre de la tabla en la base de datos

    protected $fillable = [
        'IdUsuario',
        'TipoPermiso'
    ]; // Atributos que pueden ser asignados masivamente

    public $timestamps = false; // No utilizar timestamps (created_at, updated_at)

    protected $primaryKey = 'IdPermiso'; // Clave primaria personalizada

    // Relación con el modelo Usuario si es necesario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'IdUsuario', 'IdUsuario');
    }
}
