package modelo;

public class HorarioDisponible {
    // Atributos
    private String dia;
    private String horaInicio;
    private String horaFin;
    private boolean activo;

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
}
