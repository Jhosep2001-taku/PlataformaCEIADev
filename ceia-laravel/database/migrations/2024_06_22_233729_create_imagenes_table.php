<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagenesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('imagenes', function (Blueprint $table) {
            $table->id('IdImagen');
            $table->foreignId('IdEquipo')->nullable()->constrained('equipo', 'IdEquipo')->onDelete('set null');
            $table->foreignId('IdSolicitud')->nullable()->constrained('solicitudes', 'IdSolicitud')->onDelete('set null');
            $table->string('Ruta', 255);
            $table->timestamps();
            
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('imagenes');
    }
}
