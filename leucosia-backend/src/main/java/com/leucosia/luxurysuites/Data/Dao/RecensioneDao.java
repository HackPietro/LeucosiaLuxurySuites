package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Recensione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecensioneDao extends JpaRepository<Recensione, Long> {
    Optional<Recensione> findByUtenteId(Long utenteId);

}
