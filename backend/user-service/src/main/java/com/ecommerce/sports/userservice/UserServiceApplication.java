package com.ecommerce.sports.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Clase principal del servicio de usuarios
 * 
 * Implementé esto primero porque sin auth no se puede hacer nada
 * TODO: revisar si conviene usar keycloak en el futuro
 * 
 * @author Alberto
 * @since v0.2.1 (creo)
 */
@SpringBootApplication
public class UserServiceApplication {

    // Logger para ver que pasa durante el startup - 15/04/22
    private static final Logger logger = LoggerFactory.getLogger(UserServiceApplication.class);

    public static void main(String[] args) {
        // estos timeuts los tengo q mover a un config file despues
        System.setProperty("server.connection-timeout", "8000");
        logger.info("Iniciando Servicio Usuario version 0.2");

        // esto arranca todo
        SpringApplication.run(UserServiceApplication.class, args);

        // aca podria agregar otras cosas de inicializacion si hace falta
    }
}