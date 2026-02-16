package nl.repsak.backend.controller;

import nl.repsak.backend.dao.PreviewImageDAO;
import nl.repsak.backend.dao.ProductDAO;
import nl.repsak.backend.dto.ProductDTO;
import nl.repsak.backend.models.Product;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200", "http://g4m3r5.repsak.nl/"})
@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductDAO productDAO;
    private final PreviewImageDAO previewImageDAO;

    public ProductController(ProductDAO productDAO, PreviewImageDAO previewImageDAO) {
        this.productDAO = productDAO;
        this.previewImageDAO = previewImageDAO;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(){
        return ResponseEntity.ok(this.productDAO.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(this.productDAO.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductsWithFilters(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(productDAO.searchProductsByCategoryAndName(category, query));
    }

    @GetMapping("/enhancedsearch")
    public ResponseEntity<List<Product>> enhancedSearchProducts(@RequestParam(required = true) String query){
        return ResponseEntity.ok(productDAO.searchProductsWithAI(query));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productDAO.createProduct(productDTO));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO productDTO
    ) {
        return ResponseEntity.ok(productDAO.updateProduct(id, productDTO));
    }
}

