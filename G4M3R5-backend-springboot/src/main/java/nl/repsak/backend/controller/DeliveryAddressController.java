package nl.repsak.backend.controller;

import nl.repsak.backend.dao.DeliveryAddressDAO;
import nl.repsak.backend.dto.DeliveryAddressDTO;
import nl.repsak.backend.models.DeliveryAddress;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid; // Java 23 gebruikt jakarta i.p.v. javax

@RestController
@RequestMapping("/delivery-address")
@CrossOrigin(origins = {"http://localhost:4200", "http://s1156147.student.inf-hsleiden.nl:16147/"})
public class DeliveryAddressController {
    private final DeliveryAddressDAO addressDAO;

    public DeliveryAddressController(DeliveryAddressDAO addressDAO) {
        this.addressDAO = addressDAO;
    }

    @PostMapping
    public ResponseEntity<DeliveryAddress> createAddress(
            @Valid @RequestBody DeliveryAddressDTO addressDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = extractUsername(userDetails);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        DeliveryAddress newAddress = addressDAO.createAddress(addressDTO, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAddress);
    }

    @GetMapping
    public ResponseEntity<List<DeliveryAddress>> getUserAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = extractUsername(userDetails);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(addressDAO.getUserAddresses(username));
    }

    /**
     * Extracts username from UserDetails or from SecurityContext if UserDetails is null
     */
    private String extractUsername(UserDetails userDetails) {
        if (userDetails != null) {
            return userDetails.getUsername();
        }

        // Try to get username from SecurityContext if UserDetails is null
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                return ((UserDetails) principal).getUsername();
            } else if (principal != null) {
                return principal.toString();
            }
        }
        return null;
    }
}