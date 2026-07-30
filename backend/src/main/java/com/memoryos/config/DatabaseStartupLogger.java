package com.memoryos.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseStartupLogger implements ApplicationListener<ApplicationReadyEvent> {

    private final DataSource dataSource;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            // Mask password if present in the URL
            String url = metaData.getURL();
            if (url != null && url.contains("password=")) {
                url = url.replaceAll("password=[^&]*", "password=***");
            }
            
            log.info("Connected to PostgreSQL");
            log.info("Database URL: {}", url);
            log.info("Database Product Name: {}", metaData.getDatabaseProductName());
            log.info("Database Version: {}", metaData.getDatabaseProductVersion());
            
        } catch (SQLException e) {
            log.error("Failed to connect to the database or retrieve metadata on startup.", e);
            throw new RuntimeException("Database is unavailable. Startup aborted.", e);
        }
    }
}
