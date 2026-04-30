export type StadeMaladie = 'LEGER' | 'MODERE' | 'SEVERE';
export type Orientation = 'CONSCIENT' | 'CONFUS';
export type NiveauFonctionnement = 'INDEPENDANT' | 'BESOIN_AIDE' | 'DEPENDANT';
export type EtatComportement = 'CALME' | 'ANXIEUX' | 'AGRESSIF' | 'FUGUE';

export interface DossierMedical {
  id?: number;
  patient: {
    id: number;
    numeroSecuriteSociale?: string;
    dateNaissance?: string;
    sexe?: string;
    adresse?: string;
    ville?: string;
  };
  contactPatient?: string;
  typeDiagnostic?: string;
  stade?: StadeMaladie;
  dateDiagnostic?: string;
  maladiesPrincipales?: string;
  allergies?: string;
  niveauMemoire?: string;
  orientation?: Orientation;
  niveauFonctionnement?: NiveauFonctionnement;
  medicamentsActuels?: string;
  etatComportement?: EtatComportement;
  accompagnantNom?: string;
  accompagnantContact?: string;
  notesMedecin?: string;
  derniereVisite?: string;
  dateCreation?: string;
  dateModification?: string;
}
