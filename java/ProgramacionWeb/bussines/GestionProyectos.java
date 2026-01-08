package ec.edu.ups.ProgramacionWeb.bussines;

import java.util.List;
import jakarta.inject.Inject;
import ec.edu.ups.ProgramacionWeb.DAO.ProyectoDAO;
import ec.edu.ups.ProgramacionWeb.model.Proyecto;

public class GestionProyectos {

	@Inject
	private ProyectoDAO proyectoDAO;

	public GestionProyectos() {
	}

	public Proyecto obtenerProyectoPorId(String id) {
		return proyectoDAO.read(id);
	}

	public List<Proyecto> obtenerTodosLosProyectos() {
		return proyectoDAO.getAll();
	}

	public void crearProyecto(Proyecto proyecto) throws Exception {
		if (proyecto == null) {
			throw new Exception("El proyecto no puede ser nulo");
		}
		if (proyecto.getNombre() == null || proyecto.getNombre().isEmpty()) {
			throw new Exception("El nombre del proyecto es requerido");
		}
		proyectoDAO.insert(proyecto);
	}

	public void actualizarProyecto(Proyecto proyecto) throws Exception {
		if (proyecto == null || proyecto.getId() == null) {
			throw new Exception("El proyecto no es válido");
		}
		proyectoDAO.update(proyecto);
	}

	public void eliminarProyecto(String id) throws Exception {
		proyectoDAO.delete(id);
	}

	public List<Proyecto> obtenerProyectosPorTipo(String tipo) {
		List<Proyecto> todos = proyectoDAO.getAll();
		return todos.stream().filter(p -> tipo.equals(p.getTipo())).toList();
	}
}
