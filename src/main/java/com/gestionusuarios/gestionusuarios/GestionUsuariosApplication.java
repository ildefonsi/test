package com.gestionusuarios.gestionusuarios;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
//@MapperScan("com.gestionusuarios.gestionusuarios.repository")
public class GestionUsuariosApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionUsuariosApplication.class, args);
    }

}