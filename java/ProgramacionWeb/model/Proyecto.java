package ec.edu.ups.ProgramacionWeb.model;

import java.util.Date;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name="Tabla_proyecto")
public class Proyecto {
    
    @Id
    @Column(name="pro_id", length=50)
    private String id;
    
    @Column(name="pro_nombre", length=200)
    private String nombre;
    
    @Column(name="pro_descripcion", length=500)
    private String descripcion;
    
    @Column(name="pro_tipo", length=50)
    private String tipo;
    
    @ElementCollection
    private List<String> participacion;
    
    @ElementCollection
    private List<String> tecnologias;
    
    @Column(name="pro_repositorio", length=300)
    private String repositorio;
    
    @Column(name="pro_demo", length=300)
    private String demo;
    
    @ElementCollection
    private List<String> imagenes;
    
    @Temporal(TemporalType.DATE)
    @Column(name="pro_fecha_creacion")
    private Date fechaCreacion;

    public Proyecto() {
    }

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
}
