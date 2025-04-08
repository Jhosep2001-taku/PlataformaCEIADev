<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificacionTable extends Migration
{
    public function up()
    {
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('IdUsuario')->constrained('usuario', 'IdUsuario');
            $table->enum('tipo', ['Aviso', 'Mantenimiento', 'Recordatorio']);
            $table->text('mensaje');
            $table->enum('estado', ['Leído', 'No leído'])->default('No leído');
            $table->timestamp('fecha_creacion');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->date('fecha_recordatorio')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notificaciones');
    }
}