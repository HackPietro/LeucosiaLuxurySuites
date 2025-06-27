package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtenteDao extends JpaRepository<Utente, Long> {

    Optional<Utente> findByCredenzialiEmail(String credenzialiEmail);
}
