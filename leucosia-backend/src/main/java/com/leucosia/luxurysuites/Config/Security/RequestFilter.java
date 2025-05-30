package com.leucosia.luxurysuites.Config.Security;

import com.leucosia.luxurysuites.Data.Service.UtenteServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
public class RequestFilter extends OncePerRequestFilter {

    private final UtenteServiceImpl utenteService;


    public RequestFilter(UtenteServiceImpl utenteService) {
        this.utenteService = utenteService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String accessToken = TokenStore.getInstance().getToken(request);
        System.out.println("TOKEN: " + accessToken);

        if (accessToken != null && !"invalid".equals(accessToken)) {
            try {
                String email = TokenStore.getInstance().getUserEmail(accessToken);
                UserDetails user = utenteService.loadUserByEmailForSecurity(email);
                if (user != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                System.out.println("Access token non valido, provo con il refresh token.");
                // Proviamo a usare il refresh token
                tryRefreshToken(request, response);
            }
        } else {
            System.out.println("Token non presente o invalido, provo con il refresh token.");
            tryRefreshToken(request, response);
        }

        chain.doFilter(request, response);
    }

    private void tryRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            System.out.println("Refresh token mancante");
            return;
        }

        try {
            String email = TokenStore.getInstance().getUserEmail(refreshToken);
            String newAccessToken = TokenStore.getInstance().createAccessToken(Map.of("email", email));

            // Crea nuovo cookie access_token
            var newAccessCookie = new Cookie("access_token", newAccessToken);
            newAccessCookie.setHttpOnly(false);
            newAccessCookie.setSecure(false);
            newAccessCookie.setPath("/");
            newAccessCookie.setMaxAge(900);
            newAccessCookie.setDomain("localhost");
            response.addCookie(newAccessCookie);

            // Setta anche la sicurezza
            UserDetails user = utenteService.loadUserByEmailForSecurity(email);
            if (user != null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Access token rinfrescato automaticamente");
            }
        } catch (Exception e) {
            System.out.println("Refresh token non valido o scaduto");
        }
    }

}

