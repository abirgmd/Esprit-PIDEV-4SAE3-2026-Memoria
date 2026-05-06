package MemorIA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MemorIaGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(MemorIaGatewayApplication.class, args);
    }
}
