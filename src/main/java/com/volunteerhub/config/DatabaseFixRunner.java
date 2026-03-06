package com.volunteerhub.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

@Component
public class DatabaseFixRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseFixRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
            System.out.println("SUCCESSFULLY ALTERED ROLE COLUMN TYPE TO VARCHAR(50)");
        } catch (Exception e) {
            System.out.println("ERROR ALTERING TABLE: " + e.getMessage());
        }
    }
}
