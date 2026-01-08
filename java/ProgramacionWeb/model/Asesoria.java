package ec.edu.ups.ProgramacionWeb.model;

import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name="Tabla_asesoria")
public class Asesoria {
    
    @Id
    @Column(name="ase_id", length=50)
    private String id;
    
    @Column(name="ase_usuario_uid", length=100)
    private String usuarioUid;
    
    @Column(name="ase_usuario_nombre", length=100)
    private String usuarioNombre;
    
    @Column(name="ase_usuario_email", length=100)
    private String usuarioEmail;
    
    @Column(name="ase_programador_uid", length=100)
    private String programadorUid;
    
    @Column(name="ase_programador_nombre", length=100)
    private String programadorNombre;
    
    @Column(name="ase_tema", length=200)
    private String tema;
    
    @Column(name="ase_descripcion", length=500)
    private String descripcion;
    
    @Column(name="ase_comentario", length=500)
    private String comentario;
    
    @Column(name="ase_fecha_solicitada", length=20)
    private String fechaSolicitada;
    
    @Column(name="ase_hora_solicitada", length=20)
    private String horaSolicitada;
    
    @Column(name="ase_estado", length=50)
    private String estado;
    
    @Temporal(TemporalType.DATE)
    @Column(name="ase_fecha")
    private Date fecha;
    
    @Column(name="ase_respuesta", length=500)
    private String respuesta;
    
    @Temporal(TemporalType.DATE)
    @Column(name="ase_fecha_respuesta")
    private Date fechaRespuesta;

    // Constructor vacío
    public Asesoria() {
    }

    // Constructor con parámetros
    public Asesoria(String id, String usuarioUid, String usuarioNombre, String usuarioEmail,
                    String programadorUid, String programadorNombre, String tema, String descripcion,
                    String fechaSolicitada, String horaSolicitada, String estado) {
        this.id = id;
        this.usuarioUid = usuarioUid;
        this.usuarioNombre = usuarioNombre;
        this.usuarioEmail = usuarioEmail;
        this.programadorUid = programadorUid;
        this.programadorNombre = programadorNombre;
        this.tema = tema;
        this.descripcion = descripcion;
        this.fechaSolicitada = fechaSolicitada;
        this.horaSolicitada = horaSolicitada;
        this.estado = estado;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioUid() {
        return usuarioUid;
    }

    public void setUsuarioUid(String usuarioUid) {
        this.usuarioUid = usuarioUid;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getProgramadorUid() {
        return programadorUid;
    }

    public void setProgramadorUid(String programadorUid) {
        this.programadorUid = programadorUid;
    }

    public String getProgramadorNombre() {
        return programadorNombre;
    }

    public void setProgramadorNombre(String programadorNombre) {
        this.programadorNombre = programadorNombre;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public String getFechaSolicitada() {
        return fechaSolicitada;
    }

    public void setFechaSolicitada(String fechaSolicitada) {
        this.fechaSolicitada = fechaSolicitada;
    }

    public String getHoraSolicitada() {
        return horaSolicitada;
    }

    public void setHoraSolicitada(String horaSolicitada) {
        this.horaSolicitada = horaSolicitada;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public Date getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(Date fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }
}
