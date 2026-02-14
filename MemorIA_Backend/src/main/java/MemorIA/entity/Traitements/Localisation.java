package MemorIA.entity.Traitements;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "localisation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Localisation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLocalisation;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String adresse;

    @Column(nullable = false)
    private String ville;

    @Column(name = "code_postal", nullable = false)
    private String codePostal;

    @Column(name = "batterie_dispositif")
    private Integer batterieDispositif;

    @Column(nullable = false)
    private Boolean actif;

    @Column(name = "date_mise_a_jour", nullable = false)
    private LocalDateTime dateMiseAJour;

    @OneToOne
    @JoinColumn(name = "id_traitement", nullable = false, unique = true)
    private Traitements traitement;

    @OneToMany(mappedBy = "localisation", cascade = CascadeType.ALL)
    private List<ZoneAutorisee> zonesAutorisees;

    @OneToMany(mappedBy = "localisation", cascade = CascadeType.ALL)
    private List<HistoriquePosition> historiquePositions;
}
