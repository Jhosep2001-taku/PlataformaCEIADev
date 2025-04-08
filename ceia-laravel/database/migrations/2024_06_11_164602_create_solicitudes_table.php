<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSolicitudesTable extends Migration
{
    public function up()
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id('IdSolicitud');
            $table->text('Descripcion');
            $table->string('Unidad', 100);
            $table->string('Estado')->default('Pendiente');
            $table->timestamp('FechaInicio')->useCurrent();
            $table->timestamp('FechaFin')->nullable();
            $table->string('Prioridad');
            $table->string('TipoTrabajo');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('solicitudes');
    }
}