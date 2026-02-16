package nl.repsak.backend.dto;
import java.util.List;
import nl.repsak.backend.models.OrderStatus;

public class OrderDTO {
    public long user_id;
    public long delivery_address_id;
    public List<OrderItemDTO> items;
    public OrderStatus orderStatus;
    
    @Override
    public String toString() {
        return "OrderDTO{" +
                "user_id=" + user_id +
                ", delivery_address_id=" + delivery_address_id +
                ", items=" + items +
                ", orderStatus=" + orderStatus +
                '}';
    }
}