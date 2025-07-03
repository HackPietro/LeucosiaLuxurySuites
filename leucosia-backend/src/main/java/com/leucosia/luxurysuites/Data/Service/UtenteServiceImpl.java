package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Config.EmailService;
import com.leucosia.luxurysuites.Config.Security.TokenStore;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.nimbusds.jose.JOSEException;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.*;

@Service
public class UtenteServiceImpl implements UtenteService {

    private final UtenteDao utenteDao;
    private final ModelMapper modelMapper;
    private final TokenStore tokenStore;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;


    @Value("${jwt.secret}")
    private String clientId;


    public UtenteServiceImpl(UtenteDao utenteDao, ModelMapper modelMapper, TokenStore tokenStore, PasswordEncoder passwordEncoder) {
        this.utenteDao = utenteDao;
        this.modelMapper = modelMapper;
        this.tokenStore = tokenStore;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void save(Utente utente) {
        utenteDao.save(utente);
    }


    @Override
    public UtenteDto getById(Long id) {
        Utente utente = utenteDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Non esiste un utente con id: [%s]", id)));
        UtenteDto utenteDto = modelMapper.map(utente, UtenteDto.class);
        utenteDto.setEmail(utente.getCredenziali().getEmail());
        utenteDto.setPassword(utente.getCredenziali().getPassword());
        return utenteDto;
    }


    @Override
    public UtenteDto getByEmail(String email) {
        Utente utente = utenteDao.findByCredenzialiEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("La seguente email non è presente: [%s]", email)));

        UtenteDto utenteDto = modelMapper.map(utente, UtenteDto.class);
        utenteDto.setPassword(utente.getCredenziali().getPassword());
        utenteDto.setEmail(utente.getCredenziali().getEmail());
        return utenteDto;
    }


    @Override
    public UtenteDto getUserByToken(String token) throws ParseException, JOSEException {
        Optional<Utente> utente = tokenStore.getUser(token);
        if (utente.isPresent()) {
            return modelMapper.map(utente.get(), UtenteDto.class);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public void updatePassword(String token, String newPassword) throws ParseException, JOSEException {
        Optional<Utente> utenteOptional = tokenStore.getUser(token);
        if (utenteOptional.isPresent()) {
            Utente utente = utenteOptional.get();
            utente.getCredenziali().setPassword(passwordEncoder.encode(newPassword));
            utenteDao.save(utente);
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }


    public UserDetails loadUserByEmailForSecurity(String email) throws UsernameNotFoundException {
        Optional<Utente> utente = utenteDao.findByCredenzialiEmail(email);
        if (utente.isPresent()) {
            Utente user = utente.get();
            List<SimpleGrantedAuthority> authorities;
            if (user.getTipologia().equals("admin")) {
                authorities = List.of(new SimpleGrantedAuthority("admin"));
            } else {
                authorities = List.of(new SimpleGrantedAuthority("utente"));
            }
            return new User(
                    user.getCredenziali().getEmail(),
                    user.getCredenziali().getPassword(),
                    authorities
            );
        }
        throw new UsernameNotFoundException("User not found");
    }

    public boolean emailExists(String email) {
        return utenteDao.findByCredenzialiEmail(email).isPresent();
    }

    @Override
    public void recuperoPassword(String email) throws Exception {
        UtenteDto utenteDto = getByEmail(email);

        if (utenteDto == null) {
            throw new Exception("Utente non trovato");
        }

        Utente utente = utenteDto.toEntity();

        String nuovaPassword = generaPasswordCasuale(10);

        String messaggio = "Ciao " + utente.getNome() + ",\n\n" +
                "Abbiamo generato una nuova password per il tuo account: " + nuovaPassword + "\n" +
                "Ti consigliamo di cambiarla al primo login.\n\n" +
                "Saluti,\nIl team";

        emailService.inviaEmail(utente.getCredenziali().getEmail(), "Recupero Password", messaggio);

        utente.getCredenziali().setPassword(passwordEncoder.encode(nuovaPassword));

        utenteDao.save(utente);
    }


    private String generaPasswordCasuale(int lunghezza) {
        String caratteri = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        Random rnd = new Random();
        for (int i = 0; i < lunghezza; i++) {
            password.append(caratteri.charAt(rnd.nextInt(caratteri.length())));
        }
        return password.toString();
    }

    @Override
    public String generaPasswordEInviaEmail(String nome, String email) throws Exception {
        String nuovaPassword = generaPasswordCasuale(10);

        String messaggio = "Ciao " + nome + ",\n\n" +
                "Benvenuto in Luxury Suites!\n" +
                "La tua password provvisoria è: " + nuovaPassword + "\n" +
                "Ti consigliamo di cambiarla al primo accesso.\n\n" +
                "Saluti,\nIl team";

        emailService.inviaEmail(email, "Benvenuto! Password temporanea", messaggio);

        return nuovaPassword;
    }

}