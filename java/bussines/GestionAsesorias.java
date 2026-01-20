package ec.edu.ups.ProgramacionWeb.bussines;

import java.util.List;
import jakarta.inject.Inject;
import ec.edu.ups.ProgramacionWeb.DAO.AsesoriaDAO;
import ec.edu.ups.ProgramacionWeb.model.Asesoria;

public class GestionAsesorias {

	@Inject
	private AsesoriaDAO asesoriaDAO;

	public GestionAsesorias() {
	}

	public Asesoria obtenerAsesoriaPorId(String id) {
		return asesoriaDAO.read(id);
	}

	public List<Asesoria> obtenerTodasLasAsesorias() {
		return asesoriaDAO.getAll();
	}

	public void crearAsesoria(Asesoria asesoria) throws Exception {
		if (asesoria == null) {
			throw new Exception("La asesoría no puede ser nula");
		}
		asesoriaDAO.insert(asesoria);
	}

	public void actualizarAsesoria(Asesoria asesoria) throws Exception {
		if (asesoria == null || asesoria.getId() == null) {
			throw new Exception("La asesoría no es válida");
		}
		asesoriaDAO.update(asesoria);
	}

	public void eliminarAsesoria(String id) throws Exception {
		asesoriaDAO.delete(id);
	}
}
