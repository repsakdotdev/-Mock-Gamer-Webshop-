package nl.repsak.backend.dao;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;

@Component
public class PreviewImageDAO {
    private final PreviewImageRepository previewImageRepository;

    public PreviewImageDAO(PreviewImageRepository previewImageRepository) {
        this.previewImageRepository = previewImageRepository;
    }
}
