package com._yp.gaitMate.controller.config;

import com._yp.gaitMate.GaitApplication;
import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@SpringBootTest(classes = GaitApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class IntegrationTestSupport {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    protected String getBaseUrl() {
        return "http://localhost:" + port;
    }

    /**
     * Utility method to log in a user and return headers with Bearer token.
     *
     * @param username user's username
     * @param password user's password
     * @return HttpHeaders with Authorization header set
     */
    protected HttpHeaders loginAndGetAuthHeaders(String username, String password) {
        String loginUrl = getBaseUrl() + "/api/auth/signin";

        LoginRequest request = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();

        ResponseEntity<UserInfoResponse> response = restTemplate.postForEntity(
                loginUrl, request, UserInfoResponse.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Login failed for user: " + username);
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getJwtToken());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(response.getBody().getJwtToken());
        return headers;
    }
}

