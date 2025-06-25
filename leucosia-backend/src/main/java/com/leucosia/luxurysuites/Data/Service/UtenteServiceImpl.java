package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Config.Security.TokenStore;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.nimbusds.jose.JOSEException;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
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

}