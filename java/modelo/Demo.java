package ec.edu.ups.ProgramacionWeb.modelo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.inject.Inject;
import ec.edu.ups.ProgramacionWeb.DAO.UsuarioDAO;

@Singleton
@Startup
public class Demo {

	@Inject
	private UsuarioDAO usuarioDAO;

	private static final Logger LOGGER = LoggerFactory.getLogger(Demo.class.getName());

	@PostConstruct
	public void onStartup() {
		LOGGER.info("Inicializando aplicación y datos de demo...");
		String cedulaDemo = "0302618616";
		Usuario existente = usuarioDAO.read(cedulaDemo);

		if (existente == null) {
			Usuario u = new Usuario();
			u.setCedula(cedulaDemo);
			u.setDireccion("Azogues");
			u.setNombre("Jose");
			usuarioDAO.insert(u);
			LOGGER.info("Usuario de demo insertado: " + u);
		} else {
			LOGGER.info("El usuario de demo ya existe, no se inserta.");
		}
	}
}
