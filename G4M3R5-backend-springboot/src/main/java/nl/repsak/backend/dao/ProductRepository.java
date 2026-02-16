package nl.repsak.backend.dao;

import nl.repsak.backend.models.Category;
import nl.repsak.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByNameDutchContainingIgnoreCaseOrNameEnglishContainingIgnoreCase(String nameDutch, String nameEnglish);
    List<Product> findByCategoryAndNameDutchContainingIgnoreCaseOrCategoryAndNameEnglishContainingIgnoreCase(
            Category category1, String nameDutch, Category category2, String nameEnglish);
}
