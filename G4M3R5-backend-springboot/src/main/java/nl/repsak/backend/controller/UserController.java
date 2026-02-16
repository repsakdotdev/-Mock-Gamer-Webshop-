package nl.repsak.backend.controller;

import nl.repsak.backend.dao.UserRepository;
import nl.repsak.backend.dto.UserUpdateDTO;
import nl.repsak.backend.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:4200", "http://s1156147.student.inf-hsleiden.nl:16147/"})
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println(userDetails.toString());
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Gebruiker niet ingelogd");
        }
        
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gebruiker niet gevonden");
        }
        
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/current")
    public ResponseEntity<User> updateCurrentUser(
            @RequestBody UserUpdateDTO userUpdateDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Gebruiker niet ingelogd");
        }
        
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gebruiker niet gevonden");
        }
        
        // Update user properties
        if (userUpdateDTO.username != null) {
            user.setUsername(userUpdateDTO.username);
        }
        
        if (userUpdateDTO.email != null) {
            // Check if email is already taken by another user
            User existingUser = userRepository.findByEmail(userUpdateDTO.email);
            if (existingUser != null && existingUser.getUserId() != user.getUserId()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail is al in gebruik");
            }
            user.setEmail(userUpdateDTO.email);
        }
        
        user.setInternationalUser(userUpdateDTO.isInternational);
        
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Admin endpoints
    @PutMapping("/{userId}/grant-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> grantAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gebruiker niet gevonden"));
        user.setAdmin(true);
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Pas internationalUser-status aan (Admin of eigen gebruiker)
    @PutMapping("/{userId}/international")
    public ResponseEntity<User> updateInternationalStatus(
            @PathVariable Long userId,
            @RequestParam boolean isInternational,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gebruiker niet gevonden"));

        if (!currentUser.getUsername().equals(user.getEmail()) && !currentUser.getAuthorities().contains("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Geen rechten");
        }

        user.setInternationalUser(isInternational);
        return ResponseEntity.ok(userRepository.save(user));
    }
}