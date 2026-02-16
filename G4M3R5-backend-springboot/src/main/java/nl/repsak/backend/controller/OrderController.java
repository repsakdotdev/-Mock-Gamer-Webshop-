package nl.repsak.backend.controller;

import nl.repsak.backend.dao.OrderDAO;
import nl.repsak.backend.dto.OrderDTO;
import nl.repsak.backend.models.Order;
import nl.repsak.backend.models.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200", "http://g4m3r5.repsak.nl/"})
@RestController
@RequestMapping("/order")
public class OrderController {
    private final OrderDAO orderDAO;

    public OrderController(OrderDAO orderDAO) {
        this.orderDAO = orderDAO;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(this.orderDAO.getOrderById(id));
    }

    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@RequestBody OrderDTO orderDTO,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println(orderDTO.toString());
        orderDAO.createNewOrder(orderDTO, userDetails.getUsername());
        return ResponseEntity.ok("Order succesvol geplaatst");
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Controleer op null
        }
        return ResponseEntity.ok(orderDAO.getOrdersByUserEmail(userDetails.getUsername())); // Gebruik getUsername()
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        this.orderDAO.deleteOrder(id);
        return ResponseEntity.ok("Order deleted successfully");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id, @RequestBody OrderStatus status) {
        this.orderDAO.updateOrderStatus(id, status);
        return ResponseEntity.ok("Order status updated successfully");
    }
}