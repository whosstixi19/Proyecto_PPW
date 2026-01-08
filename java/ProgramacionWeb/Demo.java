package ec.edu.ups.ProgramacionWeb;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import ec.edu.ups.ProgramacionWeb.DAO.PersonaDAO;
import ec.edu.ups.ProgramacionWeb.model.Persona;

@Singleton
@Startup
public class Demo {

	@Inject
	private PersonaDAO personaDAO;


	@PostConstruct
	public void onStartup() {
		
		// Persona 1
		Persona p1 = new Persona();
		p1.setCedula("0302618616");
		p1.setNombre("Juan Pérez");
		p1.setDireccion("Av. 24 de Mayo, Cuenca");
		insertarPersonaSiNoExiste(p1);
		
		// Persona 2
		Persona p2 = new Persona();
		p2.setCedula("0105486932");
		p2.setNombre("María González");
		p2.setDireccion("Calle Larga, Cuenca");
		insertarPersonaSiNoExiste(p2);
		
		// Persona 3
		Persona p3 = new Persona();
		p3.setCedula("0106352147");
		p3.setNombre("Pedro Rodríguez");
		p3.setDireccion("El Vergel, Cuenca");
		insertarPersonaSiNoExiste(p3);
		
		// Persona 4
		Persona p4 = new Persona();
		p4.setCedula("0107258963");
		p4.setNombre("Ana Martínez");
		p4.setDireccion("Challuabamba, Cuenca");
		insertarPersonaSiNoExiste(p4);
		
		// Persona 5
		Persona p5 = new Persona();
		p5.setCedula("0108741258");
		p5.setNombre("Carlos Sánchez");
		p5.setDireccion("Totoracocha, Cuenca");
		insertarPersonaSiNoExiste(p5);
		
		System.out.println("\n--- LISTANDO TODAS LAS PERSONAS ---");
		listarTodasLasPersonas();
	}
	
	private void insertarPersonaSiNoExiste(Persona persona) {
		Persona existente = personaDAO.read(persona.getCedula());
		
		if (existente == null) {
			personaDAO.insert(persona);
			System.out.println("✓ Persona insertada: " + persona.getCedula() + 
				" - " + persona.getNombre() + " - " + persona.getDireccion());
		} else {
			System.out.println("✗ Persona ya existe: " + existente.getCedula() + 
				" - " + existente.getNombre());
		}
	}
	
	private void listarTodasLasPersonas() {
		var personas = personaDAO.getAll();
		
		if (personas.isEmpty()) {
			System.out.println("No hay personas en la base de datos");
		} else {
			System.out.println("Total de personas: " + personas.size());
			for (Persona p : personas) {
				System.out.println("  → Cédula: " + p.getCedula() + 
					" | Nombre: " + p.getNombre() + " | Dirección: " + p.getDireccion());
			}
		}
	}
}
