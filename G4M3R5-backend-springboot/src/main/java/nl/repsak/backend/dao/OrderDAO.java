package nl.repsak.backend.dao;

import jakarta.transaction.Transactional;
import nl.repsak.backend.dto.OrderDTO;
import nl.repsak.backend.models.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class OrderDAO {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderDAO(OrderRepository orderRepository,
                    UserRepository userRepository,
                    DeliveryAddressRepository deliveryAddressRepository,
                    ProductRepository productRepository,
                    OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.deliveryAddressRepository = deliveryAddressRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public void createNewOrder(OrderDTO orderDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gebruiker niet gevonden");

        DeliveryAddress address = deliveryAddressRepository.findById(orderDTO.delivery_address_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adres niet gevonden"));

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(address);
        order.setOrderDate(LocalDateTime.now());
        
        // Set status from DTO or default to PENDING
        if (orderDTO.orderStatus != null) {
            order.setOrderStatus(orderDTO.orderStatus);
        } else {
            order.setOrderStatus(OrderStatus.PENDING);
        }

        // Bereken totaalprijs
        double total = orderDTO.items.stream()
                .mapToDouble(item -> {
                    Product product = productRepository.findById(item.productId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product niet gevonden: " + item.productId));
                    return product.getPrice() * item.quantity;
                }).sum();
        order.setTotalPrice(total);

        Order savedOrder = orderRepository.save(order);

        orderDTO.items.forEach(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(productRepository.findById(item.productId).orElseThrow());
            orderItem.setQuantity(item.quantity);
            orderItem.setOrder(savedOrder);
            orderItemRepository.save(orderItem);
        });
    }

    public List<Order> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email);
        return orderRepository.findByUser(user);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Delete associated order items first
        orderItemRepository.deleteAllByOrder(order);
        orderRepository.delete(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }
    
    @Transactional
    public void updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setOrderStatus(status);
        orderRepository.save(order);
    }
}