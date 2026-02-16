package nl.repsak.backend.dto;

public class LoginResponseDTO {
    public String email;
    public String token;
    public String username;
    public boolean admin = false;
    public boolean internationalUser;


    public LoginResponseDTO(String email, String token, String username, boolean admin, boolean internationalUser) {
        this.email = email;
        this.token = token;
        this.username = username;
        this.admin = admin;
        this.internationalUser = internationalUser;
    }
}
