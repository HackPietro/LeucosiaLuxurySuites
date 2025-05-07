package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UtenteDao extends JpaRepository<Utente, Long>, JpaSpecificationExecutor<Utente> {

    Optional<Utente> findByCredenzialiEmail(String credenzialiEmail);



}
