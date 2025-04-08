<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateEquipoTable extends Migration
{
    public function up()
    {
        Schema::create('equipo', function (Blueprint $table) {
            $table->id('IdEquipo');
            // Características
            $table->string('Equipo', 100);
            $table->string('Registro', 100)->nullable();
            $table->string('Marca', 100)->nullable();
            $table->string('Modelo', 100)->nullable();
            $table->string('Serie', 100)->nullable();
            $table->string('NIA', 100)->nullable();
            $table->string('Unidad', 100)->nullable();
            $table->string('Encargado', 100)->nullable();
            
            // Información
            $table->string('ManualUsuario', 255)->nullable();
            $table->string('ManualServicio', 255)->nullable();
            $table->string('Garantia', 100)->nullable();
            $table->string('Procedencia', 100)->nullable();

            // Datos Técnicos
            $table->string('Tencion', 100)->nullable();
            $table->string('Frecuencia', 100)->nullable();
            $table->string('Corriente', 100)->nullable();
            $table->string('Observaciones', 600)->nullable();
            
            // Estado
            $table->boolean('Estado')->default(true);
            
            // Fecha de Registro
            $table->timestamp('FechaRegistro')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    public function down()
    {
        Schema::dropIfExists('equipo');
    }
}
