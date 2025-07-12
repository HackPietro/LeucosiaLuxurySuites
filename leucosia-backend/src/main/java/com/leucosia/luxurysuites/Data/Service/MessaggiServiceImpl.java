package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Config.EmailService;
import com.leucosia.luxurysuites.Data.Dao.MessaggiDao;
import com.leucosia.luxurysuites.Data.Entities.Messaggi;
import com.leucosia.luxurysuites.Dto.MessaggiDto;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessaggiServiceImpl implements MessaggiService {

    @Autowired
    private MessaggiDao messaggiDao;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public void salvaMessaggio(MessaggiDto dto) {
        Messaggi messaggio = modelMapper.map(dto, Messaggi.class);
        messaggiDao.save(messaggio);

        String testoMessaggio = "Ciao " + messaggio.getNome() + ",\n\n" +
                "Abbiamo ricevuto il tuo messaggio correttamente. Ecco una copia del contenuto che ci hai inviato:\n\n" +
                "---------------------------------------\n" +
                messaggio.getMessaggio() + "\n" +
                "---------------------------------------\n\n" +
                "Ti risponderemo il prima possibile.\n\n" +
                "Grazie per averci contattato!\n\n" +
                "Saluti,\nIl team Luxury Suites";

        emailService.inviaEmail(
                messaggio.getEmail(),
                "Messaggio Ricevuto",
                testoMessaggio
        );
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
