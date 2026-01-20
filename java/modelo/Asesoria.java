package modelo;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "asesorias")
public class Asesoria {
    // Atributos
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_uid", referencedColumnName = "uid")
    private Usuario usuario;
    
    @Column(name = "usuario_nombre", length = 100)
    private String usuarioNombre;
    
    @Column(name = "usuario_email", length = 100)
    private String usuarioEmail;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programador_uid", referencedColumnName = "uid")
    private Programador programador;
    
    @Column(name = "programador_nombre", length = 100)
    private String programadorNombre;
    
    @Column(name = "tema", length = 100)
    private String tema;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;
    
    @Column(name = "fecha_solicitada", length = 20)
    private String fechaSolicitada;
    
    @Column(name = "hora_solicitada", length = 10)
    private String horaSolicitada;
    
    @Column(name = "estado", length = 20)
    private String estado;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha")
    private Date fecha;
    
    @Column(name = "respuesta", columnDefinition = "TEXT")
    private String respuesta;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_respuesta")
    private Date fechaRespuesta;
    
    // Mantener UIDs para compatibilidad con Firebase
    @Transient
    private String usuarioUid;
    
    @Transient
    private String programadorUid;

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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
        if (usuario != null) {
            this.usuarioUid = usuario.getUid();
        }
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

    public Programador getProgramador() {
        return programador;
    }

    public void setProgramador(Programador programador) {
        this.programador = programador;
        if (programador != null) {
            this.programadorUid = programador.getUid();
        }
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
