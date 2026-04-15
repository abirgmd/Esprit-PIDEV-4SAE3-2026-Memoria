package com.med.cognitive.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String nom;

    @NotBlank
    @Column(nullable = false)
    private String prenom;

    @NotBlank
    @Column(nullable = false)
    private String telephone;

    @NotBlank
    @Column(nullable = false)
    private String role; // PATIENT, SOIGNANT, AIDANT

    @NotNull
    @Column(nullable = false)
    private Boolean actif;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String adresse;

    // Patient-specific fields
    private LocalDate dateNaissance;
    private String sexe;

    // Soignant-specific fields
    private String specialite;
    private String matricule;

    // Aidant-specific fields
    private String relation; // e.g., FILS, EPOUSE, etc.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = true)
    private User patient; // For aidant: references the patient
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soignant_id", nullable = true)
    private User soignant; // For patient: references the soignant

    @Column(nullable = false)
    private Boolean profileCompleted = false;

    // Helper method to get display name
    public String getDisplayName() {
        return this.prenom + " " + this.nom;
    }

    // Constructor for backwards compatibility with Patient
    public User(String nom, String prenom, String email, String telephone, String role, 
                Boolean actif, LocalDate dateNaissance, String sexe, String adresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.role = role;
        this.actif = actif;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.profileCompleted = false;
    }
}
