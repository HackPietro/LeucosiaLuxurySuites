package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.MessaggiDao;
import com.leucosia.luxurysuites.Data.Entities.Messaggi;
import com.leucosia.luxurysuites.Dto.MessaggiDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessaggiServiceImpl implements MessaggiService {

    private final MessaggiDao messaggiDao;
    private final ModelMapper modelMapper;

    public MessaggiServiceImpl(MessaggiDao messaggiDao, ModelMapper modelMapper) {
        this.messaggiDao = messaggiDao;
        this.modelMapper = modelMapper;
    }

    @Override
    public void salvaMessaggio(MessaggiDto dto) {
        Messaggi messaggio = modelMapper.map(dto, Messaggi.class);
        messaggiDao.save(messaggio);
    }

    @Override
    public List<MessaggiDto> getTuttiIMessaggi() {
        List<Messaggi> messaggiList = messaggiDao.findAll();
        return messaggiList.stream()
                .map(m -> modelMapper.map(m, MessaggiDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void eliminaMessaggio(Long id) {
        System.out.println("Eliminazione messaggio con ID: " + id);
        messaggiDao.deleteById(id);
    }


}
