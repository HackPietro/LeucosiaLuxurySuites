package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.PrezzoCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrezzoCameraDao extends JpaRepository<PrezzoCamera, Long> {
    List<PrezzoCamera> findByCameraAndDataBetween(Camera camera, LocalDate start, LocalDate end);
}
