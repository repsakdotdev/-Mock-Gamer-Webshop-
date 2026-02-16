package nl.repsak.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private String nameDutch;
    private String nameEnglish;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private Set<Product> products;

    public Category() {}

    public Category(String nameDutch, String nameEnglish) {
        this.nameDutch = nameDutch;
        this.nameEnglish = nameEnglish;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getNameDutch() {
        return nameDutch;
    }

    public String getNameEnglish() {
        return nameEnglish;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setNameDutch(String nameDutch) {
        this.nameDutch = nameDutch;
    }

    public void setNameEnglish(String nameEnglish) {
        this.nameEnglish = nameEnglish;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }
}
