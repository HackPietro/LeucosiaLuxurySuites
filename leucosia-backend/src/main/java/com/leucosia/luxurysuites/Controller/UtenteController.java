package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Config.ApiResponse;
import com.leucosia.luxurysuites.Config.Security.TokenStore;
import com.leucosia.luxurysuites.Data.Service.UtenteService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RequestMapping(path="/utente-api")
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UtenteController {

    private final UtenteService utenteService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/doLogin")
    public ApiResponse<String> authenticate(@RequestParam("email") String email, @RequestParam("password") String password) throws JOSEException {
        //if (utenteService.checkBan(email)) {
            //return new ApiResponse<>(false, HttpStatus.FORBIDDEN.toString(), "Banned user account");
        //}
        //authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        String token = TokenStore.getInstance().createToken(Map.of("email", email));
        System.out.println("MOCK TOKEN: " + token);
        return new ApiResponse<>(true, HttpStatus.OK.toString(), token);
    }
}
