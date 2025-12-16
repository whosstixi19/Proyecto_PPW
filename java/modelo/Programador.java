package modelo;

import java.util.Date;
import java.util.List;

public class Programador extends Usuario {
    // Atributos específicos del Programador
    private String especialidad;
    private String descripcion;
    private String github;
    private String linkedin;
    private String twitter;
    private String portfolio;
    private List<Proyecto> proyectos;
    private List<HorarioDisponible> horariosDisponibles;
    private List<Ausencia> ausencias;

    // Constructor vacío
    public Programador() {
        super();
    }

    // Constructor con parámetros
    public Programador(String uid, String email, String displayName, String photoURL, String role, Date createdAt,
                       String especialidad, String descripcion) {
        super(uid, email, displayName, photoURL, role, createdAt);
        this.especialidad = especialidad;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getTwitter() {
        return twitter;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public List<Proyecto> getProyectos() {
        return proyectos;
    }

    public void setProyectos(List<Proyecto> proyectos) {
        this.proyectos = proyectos;
    }

    public List<HorarioDisponible> getHorariosDisponibles() {
        return horariosDisponibles;
    }

    public void setHorariosDisponibles(List<HorarioDisponible> horariosDisponibles) {
        this.horariosDisponibles = horariosDisponibles;
    }

    public List<Ausencia> getAusencias() {
        return ausencias;
    }

    public void setAusencias(List<Ausencia> ausencias) {
        this.ausencias = ausencias;
    }
}
