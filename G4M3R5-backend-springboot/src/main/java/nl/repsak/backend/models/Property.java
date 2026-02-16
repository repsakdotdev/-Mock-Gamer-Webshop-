package nl.repsak.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long propertyId;

    private String nameDutch;
    private String nameEnglish;
    private String valueDutch;
    private String valueEnglish;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    public Property(String nameDutch, String nameEnglish, String valueDutch, String valueEnglish, Product product) {
        this.nameDutch = nameDutch;
        this.nameEnglish = nameEnglish;
        this.valueDutch = valueDutch;
        this.valueEnglish = valueEnglish;
        this.product = product;
    }

    public Property() {
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public String getNameDutch() {
        return nameDutch;
    }

    public String getNameEnglish() {
        return nameEnglish;
    }

    public String getValueDutch() {
        return valueDutch;
    }

    public String getValueEnglish() {
        return valueEnglish;
    }

    public Product getProduct() {
        return product;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public void setNameDutch(String nameDutch) {
        this.nameDutch = nameDutch;
    }

    public void setNameEnglish(String nameEnglish) {
        this.nameEnglish = nameEnglish;
    }

    public void setValueDutch(String valueDutch) {
        this.valueDutch = valueDutch;
    }

    public void setValueEnglish(String valueEnglish) {
        this.valueEnglish = valueEnglish;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
