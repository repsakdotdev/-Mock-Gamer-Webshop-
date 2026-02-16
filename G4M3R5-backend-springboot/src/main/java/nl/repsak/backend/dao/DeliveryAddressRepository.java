package nl.repsak.backend.dao;

import nl.repsak.backend.models.DeliveryAddress;
import nl.repsak.backend.models.OrderItem;
import nl.repsak.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {
    List<DeliveryAddress> findByUser(User user);
}
