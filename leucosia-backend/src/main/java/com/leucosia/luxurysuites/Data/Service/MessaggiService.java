package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Dto.MessaggiDto;

import java.util.List;

public interface MessaggiService {
    void salvaMessaggio(MessaggiDto dto);
    List<MessaggiDto> getTuttiIMessaggi();
    void eliminaMessaggio(Long id);

}
