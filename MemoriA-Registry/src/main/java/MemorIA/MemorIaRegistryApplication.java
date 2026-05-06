package MemorIA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class MemorIaRegistryApplication {

    public static void main(String[] args) {
        SpringApplication.run(MemorIaRegistryApplication.class, args);
    }
}
