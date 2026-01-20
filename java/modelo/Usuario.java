package modelo;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {
    // Atributos
    @Id
    @Column(name = "uid", length = 50)
    private String uid;
    
    @Column(name = "email", length = 100, unique = true, nullable = false)
    private String email;
    
    @Column(name = "display_name", length = 100)
    private String displayName;
    
    @Column(name = "photo_url", length = 255)
    private String photoURL;
    
    @Column(name = "role", length = 20)
    private String role;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
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
