package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.CameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrezzoCameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrenotazioneDao;
import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.PrezzoCamera;
import com.leucosia.luxurysuites.Dto.CameraDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CameraServiceImpl implements CameraService {

    private final CameraDao cameraDao;

    private final PrenotazioneDao prenotazioneDao;

    private final ModelMapper modelMapper;

    private final PrezzoCameraDao prezzoCameraDao;

    public CameraServiceImpl(CameraDao cameraDao, ModelMapper modelMapper, PrenotazioneDao prenotazioneDao, PrezzoCameraDao prezzoCameraDao) {
        this.cameraDao = cameraDao;
        this.prenotazioneDao = prenotazioneDao;
        this.modelMapper = modelMapper;
        this.prezzoCameraDao = prezzoCameraDao;
    }

    @Override
    public List<CameraDto> getCamere() {
        List<Camera> camere = cameraDao.findAll();
        return camere.stream()
                .map(camera -> modelMapper.map(camera, CameraDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CameraDto> getCamereDisponibili(LocalDate checkIn, LocalDate checkOut) {
        List<Camera> camere = prenotazioneDao.findCamereDisponibili(checkIn, checkOut);

        System.out.println("Camere disponibili tra " + checkIn + " e " + checkOut + ": " + camere.size());

        return camere.stream()
                .map(camera -> modelMapper.map(camera, CameraDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PrezzoCamera> getPrezziPerPeriodo(Long cameraId, LocalDate start, LocalDate end) {
        Camera camera = cameraDao.findById(cameraId).orElseThrow(() ->
                new IllegalArgumentException("Camera non trovata con ID: " + cameraId)
        );
        return prezzoCameraDao.findByCameraAndDataBetween(camera, start, end);
    }

}
