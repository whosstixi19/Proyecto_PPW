package controlador;

import modelo.Usuario;

public class AuthController {
    
    // Método para iniciar sesión
    public Usuario login(String email, String password) {
        // Implementación pendiente
        return null;
    }
    
    // Método para cerrar sesión
    public void logout(String uid) {
        // Implementación pendiente
    }
    
    // Método para registrar un nuevo usuario
    public void registrar(Usuario usuario, String password) {
        // Implementación pendiente
    }
    
    // Método para verificar si el usuario está autenticado
    public boolean estaAutenticado(String uid) {
        // Implementación pendiente
        return false;
    }
    
    // Método para cambiar contraseña
    public void cambiarPassword(String uid, String passwordActual, String passwordNuevo) {
        // Implementación pendiente
    }
    
    // Método para recuperar contraseña
    public void recuperarPassword(String email) {
        // Implementación pendiente
    }
    
    // Método para verificar el rol del usuario
    public String verificarRol(String uid) {
        // Implementación pendiente
        return null;
    }
}
