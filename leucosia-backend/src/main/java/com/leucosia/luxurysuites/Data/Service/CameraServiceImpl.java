package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.CameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrezzoCameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrenotazioneDao;
import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.PrezzoCamera;
import com.leucosia.luxurysuites.Dto.CameraDto;
import com.leucosia.luxurysuites.Dto.PrezzoCameraDto;
import jakarta.transaction.Transactional;
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

    @Override
    @Transactional
    public void aggiungiPrezzoCamera(PrezzoCameraDto dto) {
        Camera camera = cameraDao.findById(dto.getCameraId())
                .orElseThrow(() -> new RuntimeException("Camera non trovata"));

        LocalDate currentDate = dto.getDataInizio();
        while (!currentDate.isAfter(dto.getDataFine())) {

            // 1. Cancella eventuale record esistente per quella camera e data
            prezzoCameraDao.deleteByCameraAndData(camera, currentDate);

            // 2. Crea nuovo record aggiornato
            PrezzoCamera nuovoPrezzo = new PrezzoCamera();
            nuovoPrezzo.setCamera(camera);
            nuovoPrezzo.setData(currentDate);
            nuovoPrezzo.setPrezzo(dto.getPrezzo());
            prezzoCameraDao.save(nuovoPrezzo);

            currentDate = currentDate.plusDays(1);
        }
    }

}
