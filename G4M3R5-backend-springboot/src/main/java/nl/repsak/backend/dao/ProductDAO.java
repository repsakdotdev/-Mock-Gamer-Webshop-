package nl.repsak.backend.dao;

import jakarta.transaction.Transactional;
import nl.repsak.backend.dto.ProductDTO;
import nl.repsak.backend.models.Category;
import nl.repsak.backend.models.PreviewImage;
import nl.repsak.backend.models.Product;
import nl.repsak.backend.models.Property;
import nl.repsak.backend.services.GeminiApiService;
import nl.repsak.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class ProductDAO {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PropertyRepository propertyRepository;
    private final PreviewImageRepository previewImageRepository;
    private final GeminiApiService geminiApiService;
    private final ProductService productService;

    @Autowired
    public ProductDAO(ProductRepository productRepository,
                      CategoryRepository categoryRepository,
                      PropertyRepository propertyRepository,
                      PreviewImageRepository previewImageRepository,
                      GeminiApiService geminiApiService, ProductService productService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.propertyRepository = propertyRepository;
        this.previewImageRepository = previewImageRepository;
        this.geminiApiService = geminiApiService;
        this.productService = productService;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No product found with that id"
            );
        }
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categorie niet gevonden"));
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameDutchContainingIgnoreCaseOrNameEnglishContainingIgnoreCase(query, query);
    }

    public List<Product> searchProductsWithAI(String query) {
        String AIQuery = "You help users look for products in a webshop; by them describing the kind of product they are looking for, you return a list of product ids that might be what the user is looking for. " +
                "If you're not entirely sure about a product, still return it BUT ALWAYS RESPOND IN JSON FORMAT. Even if the description is in a different language or cryptic, try to find a corresponding item.\n" +
                "The users query is \"" + query + "\"\n" +
                "RETURN IN THE FOLLOWING FORMAT: [productid1, productid2...]. IF NO MATCHING PRODUCTS, RETURN []\n" +
                "The products that are being sold are in the following json:\n" +
                this.productService.getAllProductsAsJson();
        try {
            String response = geminiApiService.makeGeminiRequest(AIQuery);
            List<Long> productIds = extractProductIds(response);
            if (productIds.isEmpty()) {
                return new ArrayList<>();
            }

            return productIds.stream()
                    .map(id -> {
                        try {
                            return getProductById(id);
                        } catch (ResponseStatusException e) {
                            System.err.println("Product met ID " + id + " niet gevonden: " + e.getMessage());
                            return null;
                        }
                    })
                    .filter(product -> product != null)
                    .collect(Collectors.toList());

        } catch (IOException | InterruptedException e) {
            System.err.println("Fout bij AI-zoekopdracht: " + e.getMessage());
            return searchProducts(query);
        }
    }

    private List<Long> extractProductIds(String response) {
        List<Long> productIds = new ArrayList<>();

        Pattern pattern = Pattern.compile("\\[(\\d+(?:\\s*,\\s*\\d+)*)\\]");
        Matcher matcher = pattern.matcher(response);

        if (matcher.find()) {
            String idsStr = matcher.group(1);
            String[] idArray = idsStr.split("\\s*,\\s*");

            for (String idStr : idArray) {
                try {
                    if (!idStr.trim().isEmpty()) {
                        productIds.add(Long.parseLong(idStr.trim()));
                    }
                } catch (NumberFormatException e) {
                    System.err.println("Ongeldig product ID: " + idStr);
                }
            }
        }

        return productIds;
    }

    public List<Product> searchProductsByCategoryAndName(Long categoryId, String query) {
        if (categoryId == null && (query == null || query.isEmpty())) {
            return getAllProducts();
        } else if (categoryId == null) {
            return searchProducts(query);
        } else if (query == null || query.isEmpty()) {
            return getProductsByCategory(categoryId);
        } else {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categorie niet gevonden"));
            return productRepository.findByCategoryAndNameDutchContainingIgnoreCaseOrCategoryAndNameEnglishContainingIgnoreCase(
                    category, query, category, query);
        }
    }

    @Transactional
    public Product updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Update basic product properties
        product.setNameDutch(productDTO.nameDutch);
        product.setNameEnglish(productDTO.nameEnglish);
        product.setDescriptionDutch(productDTO.descriptionDutch);
        product.setDescriptionEnglish(productDTO.descriptionEnglish);
        product.setPrice(productDTO.price);
        product.setForSale(productDTO.forSale);

        Category category = categoryRepository.findById(productDTO.categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category"));
        product.setCategory(category);

        // Get a reference to the collections to manipulate
        List<PreviewImage> previewImages = product.getPreviewImages();
        List<Property> properties = product.getProperties();

        // Clear existing preview images
        previewImages.clear();

        // Add new preview images
        if (productDTO.previewImages != null && !productDTO.previewImages.isEmpty()) {
            for (PreviewImage imageDTO : productDTO.previewImages) {
                PreviewImage image = new PreviewImage(imageDTO.getPath(), product);
                previewImages.add(image);
            }
        }

        // Clear existing properties
        properties.clear();

        // Add new properties
        if (productDTO.properties != null && !productDTO.properties.isEmpty()) {
            for (Property propertyDTO : productDTO.properties) {
                Property property = new Property(
                        propertyDTO.getNameDutch(),
                        propertyDTO.getNameEnglish(),
                        propertyDTO.getValueDutch(),
                        propertyDTO.getValueEnglish(),
                        product
                );
                properties.add(property);
            }
        }

        // Save and return the updated product
        return productRepository.save(product);
    }

    @Transactional
    public Product createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category"));

        Product product = new Product();

        product.setNameDutch(productDTO.nameDutch);
        product.setNameEnglish(productDTO.nameEnglish);
        product.setDescriptionDutch(productDTO.descriptionDutch);
        product.setDescriptionEnglish(productDTO.descriptionEnglish);
        product.setPrice(productDTO.price);
        product.setForSale(productDTO.forSale);
        product.setCategory(category);

        product.setProperties(new ArrayList<>());
        product.setPreviewImages(new ArrayList<>());

        product = productRepository.save(product);

        List<PreviewImage> previewImages = product.getPreviewImages();
        List<Property> properties = product.getProperties();

        // Add preview images
        if (productDTO.previewImages != null && !productDTO.previewImages.isEmpty()) {
            for (PreviewImage imageDTO : productDTO.previewImages) {
                PreviewImage image = new PreviewImage(imageDTO.getPath(), product);
                previewImages.add(image);
            }
        }

        // Add properties
        if (productDTO.properties != null && !productDTO.properties.isEmpty()) {
            for (Property propertyDTO : productDTO.properties) {
                Property property = new Property(
                        propertyDTO.getNameDutch(),
                        propertyDTO.getNameEnglish(),
                        propertyDTO.getValueDutch(),
                        propertyDTO.getValueEnglish(),
                        product
                );
                properties.add(property);
            }
        }

        // Save and return the final product with all its relationships
        return productRepository.save(product);
    }
}