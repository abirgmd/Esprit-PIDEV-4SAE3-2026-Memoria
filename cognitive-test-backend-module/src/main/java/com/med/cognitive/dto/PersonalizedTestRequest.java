package com.med.cognitive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalizedTestRequest {
    private Long patientId;
    private Long soignantId; // Optionnel - sera déterminé automatiquement depuis le patient
    private Long accompagnantId;
    private String titre;
    private String description;
    private String stage; // STABLE, MOYEN, CRITIQUE
    @JsonProperty("dateLimite")
    private String dateLimitString; // Will be String instead of LocalDate for flexibility
    private String instructions;
    private List<Item> items;

    // Helper method to convert String to LocalDate
    public LocalDate getDateLimitAsLocalDate() {
        if (dateLimitString == null || dateLimitString.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateLimitString, DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            return null;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private String question;
        private String reponse;
        private Integer score;
        private String imageUrl;
        @JsonProperty("metadata")
        private Map<String, Object> metadata; // Accept Object instead of String for flexibility
    }
}
