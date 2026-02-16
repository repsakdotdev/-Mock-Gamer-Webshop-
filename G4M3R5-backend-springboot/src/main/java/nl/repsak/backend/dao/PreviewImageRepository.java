package nl.repsak.backend.dao;

import nl.repsak.backend.models.Category;
import nl.repsak.backend.models.PreviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreviewImageRepository extends JpaRepository<PreviewImage, Long> {
}
