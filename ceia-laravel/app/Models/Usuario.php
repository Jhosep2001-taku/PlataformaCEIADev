<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuario';
    protected $primaryKey = 'IdUsuario';
    public $timestamps = false;

    protected $fillable = [
        'Documento', 'NombreCompleto', 'Correo', 'Celular', 'Clave', 'Rol', 'Estado',
    ];

    protected $hidden = [
        'Clave',
    ];

    public function getAuthPassword()
    {
        return $this->Clave;
    }
    
    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'IdUsuario', 'IdUsuario');
    }

    public function historialesMantenimiento()
    {
        return $this->hasMany(HistorialMantenimiento::class, 'IdUsuario', 'IdUsuario');
    }
    
    public function permisos()
    {
        return $this->hasMany(Permiso::class, 'IdUsuario', 'IdUsuario');
    }
}