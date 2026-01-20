package modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "ausencias")
public class Ausencia {
    // Atributos
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @Column(name = "fecha", length = 20)
    private String fecha;
    
    @Column(name = "hora_inicio", length = 10)
    private String horaInicio;
    
    @Column(name = "hora_fin", length = 10)
    private String horaFin;
    
    @Column(name = "motivo", columnDefinition = "TEXT")
    private String motivo;
    
    @Column(name = "programador_uid", length = 50)
    private String programadorUid;

    // Constructor vacío
    public Ausencia() {
    }

    // Constructor con parámetros
    public Ausencia(String id, String fecha, String horaInicio, String horaFin, String motivo) {
        this.id = id;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.motivo = motivo;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
        this.horaFin = horaFin;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getProgramadorUid() {
        return programadorUid;
    }

    public void setProgramadorUid(String programadorUid) {
        this.programadorUid = programadorUid;
    }
}
