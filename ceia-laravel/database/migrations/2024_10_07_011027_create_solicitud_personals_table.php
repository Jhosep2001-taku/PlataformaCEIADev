<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSolicitudPersonalsTable extends Migration
{
    public function up()
    {
        Schema::create('solicitud_personal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('IdSolicitud')->constrained('solicitudes', 'IdSolicitud')->onDelete('cascade');
            $table->foreignId('IdUsuario')->constrained('usuario', 'IdUsuario')->onDelete('cascade');
            $table->timestamps();

            // Añadimos un índice único para evitar duplicados
            $table->unique(['IdSolicitud', 'IdUsuario']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('solicitud_personal');
    }
}