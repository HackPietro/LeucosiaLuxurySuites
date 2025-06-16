package com.leucosia.luxurysuites.Data.Dao;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CameraDao extends JpaRepository<Camera, Long> {
}
