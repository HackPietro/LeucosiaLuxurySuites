package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.Prenotazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrenotazioneDao extends JpaRepository<Prenotazione, Long> {

    @Query("SELECT c FROM Camera c WHERE c.id NOT IN (" +
            "SELECT p.camera.id FROM Prenotazione p " +
            "WHERE p.dataCheckIn < :checkOut AND p.dataCheckOut > :checkIn)")
    List<Camera> findCamereDisponibili(LocalDate checkIn, LocalDate checkOut);

}
