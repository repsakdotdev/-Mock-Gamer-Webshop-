package nl.repsak.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "app_user") // Specifying a non-reserved name
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;
    private String username;
    @JsonIgnore
    private String password;
    private String email;
    private boolean admin = false;
    private boolean internationalUser;

    public User(long userId, String username, String password, String email, boolean admin, boolean internationalUser) {
        this.userId = userId;
        this.password = password;
        this.email = email;
        this.admin = admin;
        this.internationalUser = internationalUser;
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isInternationalUser() {
        return internationalUser;
    }

    public void setInternationalUser(boolean internationalUser) {
        this.internationalUser = internationalUser;
    }

    public User() {}
}
