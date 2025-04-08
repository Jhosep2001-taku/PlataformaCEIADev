
import { useState, useCallback } from 'react';

export const useMantenimientoFilters = () => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  });

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const applyFilters = useCallback((mantenimientos) => {
    return mantenimientos.filter(mantenimiento => {
      const matchesSearch = !filters.searchTerm || 
        mantenimiento.equipo.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesFechaInicio = !filters.fechaInicio || 
        new Date(mantenimiento.fecha) >= new Date(filters.fechaInicio);
      
      const matchesFechaFin = !filters.fechaFin || 
        new Date(mantenimiento.fecha) <= new Date(filters.fechaFin);
      
      const matchesEstado = !filters.estado || 
        mantenimiento.estado === filters.estado;

      return matchesSearch && matchesFechaInicio && matchesFechaFin && matchesEstado;
    });
  }, [filters]);

  return {
    filters,
    updateFilter,
    applyFilters
  };
};