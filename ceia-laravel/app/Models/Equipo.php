<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $table = 'equipo';
    protected $primaryKey = 'IdEquipo';
    public $timestamps = false;

    protected $fillable = [
        //Caracteristicas
        'Equipo',
        'Registro',
        'Marca',
        'Modelo',
        'Serie',
        'NIA',
        'Unidad',
        'Estado',
        'Encargado',
        //Informacion
        'ManualUsuario',
        'ManualServicio',
        'Garantia',
        'Procedencia',
        //DatosTecnicos
        'Tencion',
        'Frecuencia',
        'Corriente',
        'Observaciones',
        'Estado',
    ];

    // Relación con el modelo HistorialMantenimiento
    public function historialesMantenimiento()
    {
        return $this->hasMany(HistorialMantenimiento::class, 'IdEquipo', 'IdEquipo');
    }

    // Relación con el modelo Imagen si es necesario
    public function imagenes()
    {
        return $this->hasMany(Imagen::class, 'IdEquipo', 'IdEquipo');
    }
}
