package nl.repsak.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import nl.repsak.backend.models.PreviewImage;
import nl.repsak.backend.models.Property;

import java.util.List;

public class ProductDTO {
    @JsonAlias("product_id")
    public long productId;

    @JsonAlias("category_id")
    public long categoryId;

    public String nameDutch;
    public String nameEnglish;
    public String descriptionDutch;
    public String descriptionEnglish;
    public double price;
    public String imageUrl;
    public boolean forSale;
    public List<Property> properties;
    public List<PreviewImage> previewImages;

    public ProductDTO(long productId, long categoryId, String nameDutch, String nameEnglish, String descriptionDutch, String descriptionEnglish, double price, String imageUrl, boolean forSale, List<Property> properties, List<PreviewImage> previewImages) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.nameDutch = nameDutch;
        this.nameEnglish = nameEnglish;
        this.descriptionDutch = descriptionDutch;
        this.descriptionEnglish = descriptionEnglish;
        this.price = price;
        this.forSale = forSale;
        this.properties = properties;
        this.previewImages = previewImages;
    }
}
