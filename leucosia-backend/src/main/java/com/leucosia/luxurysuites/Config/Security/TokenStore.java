package com.leucosia.luxurysuites.Config.Security;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Component
public class TokenStore {

    @Value("${jwt.secret}")
    private String secretKey;

    @Getter
    private static TokenStore instance;

    private final UtenteDao utenteDao;

    public TokenStore(UtenteDao utenteDao) {
        this.utenteDao = utenteDao;
    }


    @PostConstruct
    public void init() {
        instance = this;
        if (secretKey == null) {
            throw new IllegalArgumentException("JWT secret key is not set.");
        }
    }
    public String createToken(Map<String, Object> claims) throws JOSEException {
        Instant issuedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant notBefore = issuedAt.minus(5, ChronoUnit.SECONDS);
        Instant expiration = issuedAt.plus(24, ChronoUnit.HOURS);

        JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder();
        for(String entry : claims.keySet())
            builder.claim(entry, claims.get(entry));
        JWTClaimsSet claimsSet = builder.issueTime(Date.from(issuedAt)).notBeforeTime(Date.from(notBefore)).expirationTime(Date.from(expiration)).build();
        Payload payload = new Payload(claimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(new JWSHeader(JWSAlgorithm.HS256), payload);
        jwsObject.sign(new MACSigner(secretKey.getBytes()));
        return jwsObject.serialize();
    }

    public boolean verifyToken(String token) throws JOSEException, ParseException {
        try {
            getUserEmail(token);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    public String getUserEmail(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        if(checkValidity(token)) return (String) signedJWT.getPayload().toJSONObject().get("email");
        throw new RuntimeException("Invalid token");
    }

    public Optional<Utente> getUser(String token) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        if (checkValidity(token)){
            String email = (String) signedJWT.getPayload().toJSONObject().get("email");
            return utenteDao.findByCredenzialiEmail(email);
        }else{
            throw new RuntimeException("Invalid token");
        }
    }

    private Boolean checkValidity(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier jwsVerifier = new MACVerifier(secretKey.getBytes());
        if(signedJWT.verify(jwsVerifier)) {
            return new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime()) && new Date().after(signedJWT.getJWTClaimsSet().getNotBeforeTime());
        }
        return false;
    }


    public String getToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(header != null && header.startsWith("Bearer "))
            return header.replace("Bearer ", "");
        return "invalid";
    }

    public String extractToken(ResponseEntity<?> response){
        String authorizationHeader = Objects.requireNonNull(response.getHeaders().get("Authorization")).get(0);
        return authorizationHeader.substring("Bearer ".length());
    }

}

