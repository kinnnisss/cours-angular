package edu.ism.gestionRv.client.web.dto;

public class PatientCreateRequestDto {
    private String userId;
    private String numero;
    private String nom;
    private String prenom;
    private String tel;
    private String adresse;
    private String antecedents;

    // Constructeurs
    public PatientCreateRequestDto() {
    }

    public PatientCreateRequestDto(String userId, String numero, String nom, String prenom, String tel, String adresse,
            String antecedents) {
        this.userId = userId;
        this.numero = numero;
        this.nom = nom;
        this.prenom = prenom;
        this.tel = tel;
        this.adresse = adresse;
        this.antecedents = antecedents;
    }

    // Getters et Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getAntecedents() {
        return antecedents;
    }

    public void setAntecedents(String antecedents) {
        this.antecedents = antecedents;
    }
}
