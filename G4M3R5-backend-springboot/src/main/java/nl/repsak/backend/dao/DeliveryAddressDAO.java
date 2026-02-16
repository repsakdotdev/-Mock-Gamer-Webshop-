package nl.repsak.backend.dao;

import nl.repsak.backend.dto.DeliveryAddressDTO;
import nl.repsak.backend.models.DeliveryAddress;
import nl.repsak.backend.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Component
public class DeliveryAddressDAO {
    private final DeliveryAddressRepository addressRepository;
    private final UserRepository userRepository;

    public DeliveryAddressDAO(DeliveryAddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public DeliveryAddress createAddress(DeliveryAddressDTO addressDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail);

        DeliveryAddress address = new DeliveryAddress();
        address.setZipCode(addressDTO.zipCode);
        address.setCity(addressDTO.city);
        address.setStreet(addressDTO.street);
        address.setHouseNumber(addressDTO.houseNumber);
        address.setReceiverName(addressDTO.receiverName);
        address.setUser(user);

        return addressRepository.save(address);
    }

    public List<DeliveryAddress> getUserAddresses(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        return addressRepository.findByUser(user);
    }
}