package controlador;

import modelo.Programador;
import modelo.Proyecto;
import modelo.HorarioDisponible;
import modelo.Ausencia;
import java.util.List;

public class ProgramadorController {
    
    // Método para crear un nuevo programador
    public void crearProgramador(Programador programador) {
        // Implementación pendiente
    }
    
    // Método para obtener un programador por ID
    public Programador obtenerProgramador(String uid) {
        // Implementación pendiente
        return null;
    }
    
    // Método para obtener todos los programadores
    public List<Programador> obtenerTodosProgramadores() {
        // Implementación pendiente
        return null;
    }
    
    // Método para actualizar información del programador
    public void actualizarProgramador(Programador programador) {
        // Implementación pendiente
    }
    
    // Método para agregar un proyecto al programador
    public void agregarProyecto(String programadorUid, Proyecto proyecto) {
        // Implementación pendiente
    }
    
    // Método para eliminar un proyecto del programador
    public void eliminarProyecto(String programadorUid, String proyectoId) {
        // Implementación pendiente
    }
    
    // Método para configurar horarios disponibles
    public void configurarHorarios(String programadorUid, List<HorarioDisponible> horarios) {
        // Implementación pendiente
    }
    
    // Método para registrar una ausencia
    public void registrarAusencia(String programadorUid, Ausencia ausencia) {
        // Implementación pendiente
    }
    
    // Método para obtener programadores por especialidad
    public List<Programador> obtenerPorEspecialidad(String especialidad) {
        // Implementación pendiente
        return null;
    }
}
