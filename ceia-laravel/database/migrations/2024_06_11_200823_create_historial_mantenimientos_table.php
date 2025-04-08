<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistorialMantenimientosTable extends Migration
{
    public function up()
    {
        Schema::create('historial_mantenimientos', function (Blueprint $table) {
            $table->id('IdHistorial');
            $table->date('FechaMantenimiento')->nullable();
            $table->text('DescripcionTrabajo')->nullable();
            $table->string('TipoTrabajo')->nullable();
            

            //relaciones con equipo y solicitud
            $table->foreignId('IdEquipo')->nullable()->constrained('equipo', 'IdEquipo');
            $table->foreignId('IdSolicitud')->nullable()->constrained('solicitudes', 'IdSolicitud');
            $table->timestamps();
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('historial_mantenimientos');
    }
}