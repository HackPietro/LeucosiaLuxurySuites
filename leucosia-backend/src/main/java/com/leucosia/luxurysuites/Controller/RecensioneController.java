package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.RecensioneService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/recensione-api")
@RequiredArgsConstructor
public class RecensioneController {

    @Autowired
    private RecensioneService recensioneService;
}
