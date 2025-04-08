# PLATAFORMACEIA - Sistema de Gestión para Centro de Instrumentación Analítica

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)

Sistema integral para la gestión de equipos, personal y mantenimientos en centros de instrumentación analítica.

![Vista Principal](https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/login.png)

## 🌟 Características Principales

- **Gestión completa de equipos** con historial de mantenimientos
- **Sistema de solicitudes** con seguimiento de estado y prioridades
- **Control de usuarios** con sistema de permisos granular
- **Documentación técnica** con imágenes asociadas
- **Calendario de mantenimientos** visual
- **Interfaz responsive** para uso en móvil y escritorio

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Descripción | Versión |
|------------|-------------|---------|
| React.js | Biblioteca principal para UI | 18.2.0 |
| Material-UI | Componentes estilizados | 5.14.2 |
| Axios | Cliente HTTP para APIs | 1.4.0 |
| React Router | Manejo de navegación | 6.14.1 |
| Chart.js | Visualización de datos | 4.3.0 |

### Backend
| Tecnología | Descripción | Versión |
|------------|-------------|---------|
| Laravel | Framework PHP principal | 9.52.0 |
| MySQL | Base de datos relacional | 8.0.32 |
| Laravel Sanctum | Autenticación por tokens | 3.2.1 |
| Eloquent ORM | Gestión de base de datos | 9.52.0 |

## 📸 Demostración Visual

### Autenticación y Usuarios
<div align="center">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/login.png" alt="Login" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/accesodenegado.png" alt="Acceso Denegado" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/CrearUsuario.png" alt="Crear Usuario" width="30%">
  
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/editarUsuario.png" alt="Editar Usuario" width="45%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/gUsuarios.png" alt="Gestión de Usuarios" width="45%">
</div>

### Gestión de Equipos
<div align="center">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/gEquipos.png" alt="Lista de Equipos" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/EditEquipo.png" alt="Editar Equipo" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/imagenEquipo.png" alt="Imágenes de Equipo" width="30%">
</div>

### Sistema de Solicitudes
<div align="center">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/gSolicitudes.png" alt="Lista de Solicitudes" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/agregarSolicitud.png" alt="Agregar Solicitud" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/solicitudAgregada.png" alt="Solicitud Creada" width="30%">
  
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/asignarPersonal.png" alt="Asignar Personal" width="45%">
</div>

### Mantenimientos y Calendario
<div align="center">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/historialDeMantenimientos.png" alt="Historial de Mantenimientos" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/editarMantenimiento.png" alt="Editar Mantenimiento" width="30%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/equiposAsociadosMantenimiento.png" alt="Equipos Asociados" width="30%">
  
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/calendarioDeTraajo.png" alt="Calendario de Trabajo" width="45%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/historialDeMantenimientohistorico.png" alt="Historial Completo" width="45%">
</div>

### Permisos y Configuraciones
<div align="center">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/gpermisos.png" alt="Gestión de Permisos" width="45%">
  <img src="https://raw.githubusercontent.com/Jhosep2001-taku/PlataformaCEIADev/main/Imagenes/permisos.png" alt="Asignación de Permisos" width="45%">
</div>

## 🚀 Instalación

### Requisitos Previos
- PHP 8.0+
- Composer 2.5+
- Node.js 16+
- MySQL 5.7+

### Pasos de Configuración

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/Jhosep2001-taku/PlataformaCEIADev.git
   cd PlataformaCEIADev
