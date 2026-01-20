package modelo;

import java.util.Date;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "proyectos")
public class Proyecto {
    // Atributos
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @Column(name = "nombre", length = 150, nullable = false)
    private String nombre;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "tipo", length = 50)
    private String tipo;
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "proyecto_participacion", joinColumns = @JoinColumn(name = "proyecto_id"))
    @Column(name = "participante")
    private List<String> participacion;
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "proyecto_tecnologias", joinColumns = @JoinColumn(name = "proyecto_id"))
    @Column(name = "tecnologia")
    private List<String> tecnologias;
    
    @Column(name = "repositorio", length = 255)
    private String repositorio;
    
    @Column(name = "demo", length = 255)
    private String demo;
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "proyecto_imagenes", joinColumns = @JoinColumn(name = "proyecto_id"))
    @Column(name = "imagen", length = 255)
    private List<String> imagenes;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_creacion")
    private Date fechaCreacion;
    
    @ManyToMany(mappedBy = "proyectos", fetch = FetchType.LAZY)
    private List<Programador> programadores;

    // Constructor vacío
    public Proyecto() {
    }

    // Constructor con parámetros
    public Proyecto(String id, String nombre, String descripcion, String tipo,
                    List<String> participacion, List<String> tecnologias, Date fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.participacion = participacion;
        this.tecnologias = tecnologias;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public List<String> getParticipacion() {
        return participacion;
    }

    public void setParticipacion(List<String> participacion) {
        this.participacion = participacion;
    }

    public List<String> getTecnologias() {
        return tecnologias;
    }

    public void setTecnologias(List<String> tecnologias) {
        this.tecnologias = tecnologias;
    }

    public String getRepositorio() {
        return repositorio;
    }

    public void setRepositorio(String repositorio) {
        this.repositorio = repositorio;
    }

    public String getDemo() {
        return demo;
    }

    public void setDemo(String demo) {
        this.demo = demo;
    }

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<Programador> getProgramadores() {
        return programadores;
    }

    public void setProgramadores(List<Programador> programadores) {
        this.programadores = programadores;
    }
}
