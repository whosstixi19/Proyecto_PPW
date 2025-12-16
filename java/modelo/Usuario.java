package modelo;

import java.util.Date;

public class Usuario {
    // Atributos
    private String uid;
    private String email;
    private String displayName;
    private String photoURL;
    private String role;
    private Date createdAt;

    // Constructor vacío
    public Usuario() {
    }

    // Constructor con parámetros
    public Usuario(String uid, String email, String displayName, String photoURL, String role, Date createdAt) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.role = role;
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
