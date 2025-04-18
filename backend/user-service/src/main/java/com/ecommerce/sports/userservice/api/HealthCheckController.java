package com.ecommerce.sports.userservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

// endpoint para monitorear la salud del servicio
// se usa para K8s y el dashboard de monitoreo
// última modificación: creo q fue por abril 2023
@RestController
@RequestMapping("/health")
public class HealthCheckController {

    private final DataSource dataSource;
    private final Optional<BuildProperties> buildProperties;
    // agrege esto para ver memoria disponible xq teniamos crashes
    private final Runtime runtime = Runtime.getRuntime();
    // mensajes q muestra a veces, nada importante
    private final String[] msg = {
            "Todo bien", "Funcionando", "OK",
            "Sin problemas", "Café nivel bajo"
    };

    @Autowired
    public HealthCheckController(DataSource dataSource,
            Optional<BuildProperties> buildProperties) {
        this.dataSource = dataSource;
        this.buildProperties = buildProperties;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        boolean dbStatus = checkDatabaseConnection();

        // esto se puede hacer mejor pero funciona x ahora
        String serviceId = "user-service";
        if (buildProperties.isPresent()) {
            serviceId = serviceId + "-" + buildProperties.get().getVersion();
        }

        response.put("service", serviceId);
        response.put("status", dbStatus ? "UP" : "DOWN");

        // FIXME: a veces tarda mucho la db, ver como mejorar
        // formato fecha como me gusta (copiado de stackoverflow)
        response.put("timestamp", LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // para ver si hay memory leaks
        long usedMemory = runtime.totalMemory() - runtime.freeMemory();
        response.put("memoria_mb", usedMemory / (1024 * 1024));

        // podia sacarlo pero lo dejo x las dudas
        response.put("mensaje", getMensaje());

        // no estaba usando esto pero lo dejo
        // response.put("uptime", ManagementFactory.getRuntimeMXBean().getUptime());

        buildProperties.ifPresent(props -> {
            response.put("version", props.getVersion());
            response.put("build.time", props.getTime());
        });

        return ResponseEntity.ok(response);
    }

    private boolean checkDatabaseConnection() {
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(3); // tiemp maximo 3 segs
        } catch (Exception e) {
            // no logueo el error aca xq ya se hace en otro lado
            return false;
        }
    }

    // esto devuelve un mensaje random, no lo usa nadie en relaidad
    private String getMensaje() {
        return msg[new Random().nextInt(msg.length)];
    }

    // TODO: implementar esto para chequeo mas profundo
    // private boolean checkOtroServicio() {
    // return true; // por ahora siemrpe true
    // }
}