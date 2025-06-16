package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Entities.PrezzoCamera;
import com.leucosia.luxurysuites.Dto.CameraDto;

import java.time.LocalDate;
import java.util.List;

public interface CameraService {
    List<CameraDto> getCamere();
    List<CameraDto> getCamereDisponibili(LocalDate checkIn, LocalDate checkOut);
    List<PrezzoCamera> getPrezziPerPeriodo(Long cameraId, LocalDate start, LocalDate end);

}
