package nl.repsak.backend.controller;

import nl.repsak.backend.dao.CategoryDAO;
import nl.repsak.backend.dao.CategoryRepository;
import nl.repsak.backend.dto.CategoryDTO;
import nl.repsak.backend.models.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200", "http://g4m3r5.repsak.nl/"})
@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final CategoryDAO categoryDAO;

    public CategoryController(CategoryRepository categoryRepository, CategoryDAO categoryDAO) {
        this.categoryRepository = categoryRepository;
        this.categoryDAO = categoryDAO;
    }
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryDAO.getAllCategories());
    }

    // Maak nieuwe categorie (Admin-only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category category = new Category(categoryDTO.nameDutch, categoryDTO.nameEnglish);
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    // Update categorie (Admin-only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO categoryDTO
    ) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categorie niet gevonden"));
        category.setNameDutch(categoryDTO.nameDutch);
        category.setNameEnglish(categoryDTO.nameEnglish);
        return ResponseEntity.ok(categoryRepository.save(category));
    }
}