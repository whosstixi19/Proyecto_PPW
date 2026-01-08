package modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "horarios_disponibles")
public class HorarioDisponible {
    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "dia", length = 20, nullable = false)
    private String dia;
    
    @Column(name = "hora_inicio", length = 10)
    private String horaInicio;
    
    @Column(name = "hora_fin", length = 10)
    private String horaFin;
    
    @Column(name = "activo")
    private boolean activo;
    
    @Column(name = "programador_uid", length = 50)
    private String programadorUid;

    // Constructor vacío
    public HorarioDisponible() {
    }

    // Constructor con parámetros
    public HorarioDisponible(String dia, String horaInicio, String horaFin, boolean activo) {
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.activo = activo;
    }

    // Getters y Setters
    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
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

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProgramadorUid() {
        return programadorUid;
    }

    public void setProgramadorUid(String programadorUid) {
        this.programadorUid = programadorUid;
    }
}
