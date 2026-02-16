package nl.repsak.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import nl.repsak.backend.dto.ProductDTO;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String nameDutch;
    private String nameEnglish;
    private String descriptionDutch;
    private String descriptionEnglish;
    private double price;
    private boolean isForSale;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Property> properties;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreviewImage> previewImages;

    public Product(String nameDutch, String nameEnglish, String descriptionDutch, String descriptionEnglish, double price, String imageUrl, boolean isForSale, Category category) {
        this.nameDutch = nameDutch;
        this.nameEnglish = nameEnglish;
        this.descriptionDutch = descriptionDutch;
        this.descriptionEnglish = descriptionEnglish;
        this.price = price;
        this.isForSale = isForSale;
        this.category = category;
    }

    public Product(ProductDTO productDTO) {
        this.nameDutch = productDTO.nameDutch;
    }

    public Product() {
    }

    public Long getProductId() {
        return productId;
    }

    public String getNameDutch() {
        return nameDutch;
    }

    public String getNameEnglish() {
        return nameEnglish;
    }

    public String getDescriptionDutch() {
        return descriptionDutch;
    }

    public String getDescriptionEnglish() {
        return descriptionEnglish;
    }

    public double getPrice() {
        return price;
    }

    public boolean isForSale() {
        return isForSale;
    }

    public Category getCategory() {
        return category;
    }

    public List<Property> getProperties() {
        if (properties == null) {
            properties = new ArrayList<>();
        }
        return properties;
    }

    public List<PreviewImage> getPreviewImages() {
        if (previewImages == null) {
            previewImages = new ArrayList<>();
        }
        return previewImages;
    }

    public void setPreviewImages(List<PreviewImage> previewImages) {
        this.previewImages = previewImages;
    }

    public void setProperties(List<Property> properties) {
        this.properties = properties;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setForSale(boolean forSale) {
        isForSale = forSale;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setDescriptionEnglish(String descriptionEnglish) {
        this.descriptionEnglish = descriptionEnglish;
    }

    public void setDescriptionDutch(String descriptionDutch) {
        this.descriptionDutch = descriptionDutch;
    }

    public void setNameEnglish(String nameEnglish) {
        this.nameEnglish = nameEnglish;
    }

    public void setNameDutch(String nameDutch) {
        this.nameDutch = nameDutch;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    // Helper methods to manage bidirectional relationships
    public void addPreviewImage(PreviewImage image) {
        getPreviewImages().add(image);
        image.setProduct(this);
    }
    
    public void removePreviewImage(PreviewImage image) {
        getPreviewImages().remove(image);
        image.setProduct(null);
    }
    
    public void addProperty(Property property) {
        getProperties().add(property);
        property.setProduct(this);
    }
    
    public void removeProperty(Property property) {
        getProperties().remove(property);
        property.setProduct(null);
    }
}
