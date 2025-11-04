package rescueTeam.location;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class RescueTeamLocationApplication {

    public static void main(String[] args) {
        SpringApplication.run(RescueTeamLocationApplication.class, args);
    }

    @Bean
    CommandLineRunner testDatabaseConnection(DataSource dataSource) {
        return args -> {
            System.out.println("🔍 Checking PostgreSQL connection...");
            try (Connection conn = dataSource.getConnection()) {
                System.out.println("✅ Connected successfully to PostgreSQL: " + conn.getMetaData().getURL());
            } catch (Exception e) {
                System.err.println("❌ Failed to connect to PostgreSQL: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
