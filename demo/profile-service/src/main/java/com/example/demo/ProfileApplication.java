package com.example.demo;

import org.neo4j.driver.Driver;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
@EnableNeo4jRepositories(basePackages = "com.example.demo.repository")
public class ProfileApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProfileApplication.class, args);
	}
    @Bean
    CommandLineRunner testNeo4jConnection(Driver driver) {
        return args -> {
            try (var session = driver.session()) {
                var result = session.run("RETURN 'Hello Neo4j!' AS message");
                while (result.hasNext()) {
                    var record = result.next();
                    System.out.println("KẾT NỐI NEO4J THÀNH CÔNG: " + record.get("message").asString());
                }
            } catch (Exception e) {
                System.err.println("LỖI KẾT NỐI NEO4J: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

}

