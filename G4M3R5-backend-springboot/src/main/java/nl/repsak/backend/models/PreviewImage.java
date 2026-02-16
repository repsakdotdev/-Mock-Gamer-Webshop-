package nl.repsak.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class PreviewImage {
    @Id
    @GeneratedValue
    private long previewImageId;
    private String path;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    public PreviewImage(String path, Product product) {
        this.path = path;
        this.product = product;
    }

    public PreviewImage() {}

    public long getPreviewImageId() {
        return previewImageId;
    }

    public String getPath() {
        return path;
    }

    public Product getProduct() {
        return product;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public void setPreviewImageId(long previewImageId) {
        this.previewImageId = previewImageId;
    }
}
