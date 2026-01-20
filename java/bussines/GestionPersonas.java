package ec.edu.ups.ProgramacionWeb.bussines;

import java.util.List;
import jakarta.inject.Inject;
import ec.edu.ups.ProgramacionWeb.DAO.PersonaDAO;
import ec.edu.ups.ProgramacionWeb.model.Persona;

public class GestionPersonas {

	@Inject
	private PersonaDAO personaDAO;

	public GestionPersonas() {
	}

	public Persona obtenerPersonaPorCedula(String cedula) {
		return personaDAO.read(cedula);
	}

	public List<Persona> obtenerTodasLasPersonas() {
		return personaDAO.getAll();
	}

	public void crearPersona(Persona persona) throws Exception {
		if (persona == null) {
			throw new Exception("La persona no puede ser nula");
		}
		if (persona.getCedula() == null || persona.getCedula().isEmpty()) {
			throw new Exception("La cédula es requerida");
		}
		if (persona.getNombre() == null || persona.getNombre().isEmpty()) {
			throw new Exception("El nombre es requerido");
		}
		personaDAO.insert(persona);
	}

	public void actualizarPersona(Persona persona) throws Exception {
		if (persona == null || persona.getCedula() == null) {
			throw new Exception("La persona no es válida");
		}
		personaDAO.update(persona);
	}

	public void eliminarPersona(String cedula) throws Exception {
		personaDAO.delete(cedula);
	}

	public Persona obtenerPersonaPorNombre(String nombre) {
		List<Persona> personas = personaDAO.getAll();
		for (Persona p : personas) {
			if (p.getNombre().equalsIgnoreCase(nombre)) {
				return p;
			}
		}
		return null;
	}
}
