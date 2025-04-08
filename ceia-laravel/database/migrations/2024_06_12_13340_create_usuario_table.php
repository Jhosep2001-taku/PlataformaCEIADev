<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuarioTable extends Migration
{
    public function up()
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->id('IdUsuario');
            $table->string('Documento', 50);
            $table->string('NombreCompleto', 100);
            $table->string('Correo', 50);
            $table->string('Celular', 50);
            $table->string('Clave', 255);
            $table->string('Rol', 50);
            $table->boolean('Estado');
            $table->timestamp('FechaRegistro')->default(DB::raw('CURRENT_TIMESTAMP'));
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('usuario');
    }
}