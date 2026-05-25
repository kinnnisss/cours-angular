-- Migration: Create Demandes Table
-- Author: Backend Team
-- Date: 2024
-- Description: Crée la table demandes et les index associés

-- Table principale
CREATE TABLE IF NOT EXISTS demandes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    date_consultation DATE NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'CREEE',
    motif LONGTEXT,
    remarques LONGTEXT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_demande_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT chk_statut CHECK (statut IN ('CREEE', 'VALIDEE', 'ANNULEE', 'COMPLETEE'))
);

-- Indexes pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_demande_patient_id ON demandes(patient_id);
CREATE INDEX IF NOT EXISTS idx_demande_date_consultation ON demandes(date_consultation);
CREATE INDEX IF NOT EXISTS idx_demande_statut ON demandes(statut);
CREATE INDEX IF NOT EXISTS idx_demande_patient_date ON demandes(patient_id, date_consultation);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_demande_date_creation ON demandes(date_creation);
CREATE INDEX IF NOT EXISTS idx_demande_statut_date ON demandes(statut, date_consultation);
