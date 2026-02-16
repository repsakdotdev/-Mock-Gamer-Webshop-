package nl.repsak.backend.controller;

import nl.repsak.backend.config.JWTUtil;
import nl.repsak.backend.dao.UserRepository;
import nl.repsak.backend.dto.LoginRequestDTO;
import nl.repsak.backend.dto.LoginResponseDTO;
import nl.repsak.backend.dto.UserDTO;
import nl.repsak.backend.models.User;
import nl.repsak.backend.services.CredentialValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://g4m3r5.repsak.nl/"})
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userDAO;
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;
    private CredentialValidator validator;

    public AuthController(UserRepository userDAO, JWTUtil jwtUtil, AuthenticationManager authManager,
                          PasswordEncoder passwordEncoder, CredentialValidator validator) {
        this.userDAO = userDAO;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.validator = validator;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO body) {
        try {
            UsernamePasswordAuthenticationToken authInputToken =
                    new UsernamePasswordAuthenticationToken(body.email, body.password);

            authManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(body.email);

            User user = userDAO.findByEmail(body.email);
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO(user.getEmail(), token, user.getUsername(), user.isAdmin(), user.isInternationalUser());


            return ResponseEntity.ok(loginResponseDTO);

        } catch (AuthenticationException authExc) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "No valid credentials"
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody UserDTO userDTO) {
        if (!validator.isValidEmail(userDTO.email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ongeldig e-mailadres");
        }
        // Controleer of gebruikersnaam al bestaat
        if (userDAO.findByEmail(userDTO.email) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mailadres al in gebruik");
        }

        User newUser = new User();
        newUser.setEmail(userDTO.email);
        newUser.setPassword(passwordEncoder.encode(userDTO.password));
        newUser.setUsername(userDTO.username);
        newUser.setInternationalUser(userDTO.internationalUser);

        userDAO.save(newUser);

        String token = jwtUtil.generateToken(newUser.getEmail());
        return ResponseEntity.ok(new LoginResponseDTO(newUser.getEmail(), token, newUser.getUsername(), newUser.isAdmin(), newUser.isInternationalUser()));
    }
}
