package modelo;

import java.util.Date;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "programadores")
@PrimaryKeyJoinColumn(name = "uid")
public class Programador extends Usuario {
    // Atributos específicos del Programador
    @Column(name = "especialidad", length = 100)
    private String especialidad;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "github", length = 100)
    private String github;
    
    @Column(name = "linkedin", length = 100)
    private String linkedin;
    
    @Column(name = "twitter", length = 100)
    private String twitter;
    
    
    @Column(name = "portfolio", length = 255)
    private String portfolio;
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "programador_proyecto",
        joinColumns = @JoinColumn(name = "programador_uid"),
        inverseJoinColumns = @JoinColumn(name = "proyecto_id")
    )
    private List<Proyecto> proyectos;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "programador_uid")
    private List<HorarioDisponible> horariosDisponibles;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "programador_uid")
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
