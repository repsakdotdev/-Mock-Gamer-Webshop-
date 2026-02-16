package nl.repsak.backend.dto;
import jakarta.validation.constraints.NotBlank;

public class DeliveryAddressDTO {
    @NotBlank(message = "Postcode is verplicht")
    public String zipCode;

    @NotBlank(message = "Stad is verplicht")
    public String city;

    @NotBlank(message = "Straatnaam is verplicht")
    public String street;

    @NotBlank(message = "Huisnummer is verplicht")
    public String houseNumber;

    @NotBlank(message = "Naam ontvanger is verplicht")
    public String receiverName;
}