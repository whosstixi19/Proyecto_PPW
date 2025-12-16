package modelo;

import java.util.Date;
import java.util.List;

public class Proyecto {
    // Atributos
    private String id;
    private String nombre;
    private String descripcion;
    private String tipo;
    private List<String> participacion;
    private List<String> tecnologias;
    private String repositorio;
    private String demo;
    private List<String> imagenes;
    private Date fechaCreacion;

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
}
