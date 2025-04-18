package com.ecommerce.milicons.userservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Simple health check controller to monitor service status
 */
@RestController
@RequestMapping("/health")
public class HealthCheckController {

    private final DataSource dataSource;
    private final Optional<BuildProperties> buildProperties;

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

        response.put("service", "user-service");
        response.put("status", dbStatus ? "UP" : "DOWN");
        response.put("timestamp", LocalDateTime.now().toString());

        buildProperties.ifPresent(props -> {
            response.put("version", props.getVersion());
            response.put("build.time", props.getTime().toString());
        });

        return ResponseEntity.ok(response);
    }

    private boolean checkDatabaseConnection() {
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(3); // 3 second timeout
        } catch (Exception e) {
            return false;
        }
    }
}