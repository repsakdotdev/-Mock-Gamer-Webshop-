package nl.repsak.backend.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class GeminiApiService {

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private String apiKey;

    // Constructor die direct de API-sleutel laadt wanneer de service wordt geïnitialiseerd
    public GeminiApiService() {
        this.apiKey = readApiKeyFromFile();
        if (this.apiKey == null || this.apiKey.trim().isEmpty()) {
            throw new RuntimeException("Geen geldige API-sleutel gevonden in het bestand resources/static/pleasedontabuseme.key");
        }
    }

    /**
     * Leest de API-sleutel uit het bestand resources/static/pleasedontabuseme.key
     */
    private String readApiKeyFromFile() {
        try {
            ClassLoader classLoader = GeminiApiService.class.getClassLoader();
            InputStream inputStream = classLoader.getResourceAsStream("static/pleasedontabuseme.key");

            if (inputStream == null) {
                throw new IOException("API-sleutel bestand niet gevonden: static/pleasedontabuseme.key");
            }

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                return reader.lines().collect(Collectors.joining()).trim();
            }
        } catch (IOException e) {
            throw new RuntimeException("Fout bij het lezen van de API-sleutel: " + e.getMessage(), e);
        }
    }

    public String makeGeminiRequest(String prompt) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .connectTimeout(Duration.ofSeconds(10))
                .build();

        String requestBody = String.format("""
                {
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": "%s"
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.5,
                        "topP": 1,
                        "topK": 32,
                        "maxOutputTokens": 2048,
                    }
                }
                """, prompt.replace("\"", "\\\""));

        // Build HTTP request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL + "?key=" + this.apiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        // Send request and get response
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
}