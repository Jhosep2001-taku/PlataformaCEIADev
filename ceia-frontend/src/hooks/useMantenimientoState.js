import { useState, useEffect } from 'react';

export const useMantenimientoState = (mantenimientos, equipos) => {
  const [equiposState, setEquipos] = useState([]);
  const [mantenimientosConEquipos, setMantenimientosConEquipos] = useState([]);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para diálogos
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSelectEquipoDialogOpen, setIsSelectEquipoDialogOpen] = useState(false);
  const [isAddEquipoDialogOpen, setIsAddEquipoDialogOpen] = useState(false);

  useEffect(() => {
    if (mantenimientos && equipos) {
      const mantenimientosDetallados = mantenimientos.map(mantenimiento => ({
        ...mantenimiento,
        equipo: equipos.find(e => e.IdEquipo === mantenimiento.IdEquipo)
      }));
      setMantenimientosConEquipos(mantenimientosDetallados);
    }
  }, [mantenimientos, equipos]);

  useEffect(() => {
    if (equipos) {
      setEquipos(equipos);
    }
  }, [equipos]);

  return {
    equiposState,
    setEquipos,
    mantenimientosConEquipos,
    setMantenimientosConEquipos,
    selectedHistorial,
    setSelectedHistorial,
    selectedEquipo,
    setSelectedEquipo,
    searchTerm,
    setSearchTerm,
    isDuplicateDialogOpen,
    setIsDuplicateDialogOpen,
    isDialogOpen,
    setIsDialogOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    isSelectEquipoDialogOpen,
    setIsSelectEquipoDialogOpen,
    isAddEquipoDialogOpen,
    setIsAddEquipoDialogOpen
  };
};

