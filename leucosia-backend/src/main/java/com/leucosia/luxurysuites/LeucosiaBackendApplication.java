package com.leucosia.luxurysuites;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;


@SpringBootApplication
@ServletComponentScan
public class LeucosiaBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(LeucosiaBackendApplication.class, args);
    }

}
