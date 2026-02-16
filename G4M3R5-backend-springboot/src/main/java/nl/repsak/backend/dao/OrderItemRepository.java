package nl.repsak.backend.dao;

import nl.repsak.backend.models.Order;
import nl.repsak.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findAllByOrder(Order order);
    void deleteAllByOrder(Order order);
}