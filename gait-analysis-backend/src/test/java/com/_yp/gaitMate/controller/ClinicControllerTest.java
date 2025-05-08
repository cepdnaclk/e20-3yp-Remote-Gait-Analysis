package com._yp.gaitMate.controller;


import com._yp.gaitMate.GaitApplication;
import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.mapper.ClinicMapper;
import com._yp.gaitMate.repository.ClinicRepository;
import com._yp.gaitMate.security.dto.LoginRequest;
import com._yp.gaitMate.security.dto.UserInfoResponse;
import com._yp.gaitMate.security.mapper.Mapper;
import com._yp.gaitMate.security.repository.UserRepository;
import com._yp.gaitMate.security.service.AuthenticationService;
import com._yp.gaitMate.security.utils.AuthUtil;
import com._yp.gaitMate.service.clinicService.ClinicService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = GaitApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ClinicControllerTest {
    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private  ClinicService clinicService;

    private HttpHeaders headers;

    private String getBaseUrl(){
        return "http://localhost:" + port;
    }

    @BeforeEach
    void setUp() throws JsonProcessingException {
        // Login as admin
        String loginUrl = getBaseUrl() + "/api/auth/signin";

        LoginRequest request = LoginRequest.builder()
                .username("admin")
                .password("password")
                .build();

        ResponseEntity<UserInfoResponse> response = restTemplate.postForEntity(
                loginUrl,
                request,
                UserInfoResponse.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Login request failed");
        assertNotNull(response.getBody(), "Response body is null");
        assertNotNull(response.getBody().getJwtToken(), "JWT token is missing");

        String jwtToken = response.getBody().getJwtToken();

        // Prepare headers with Bearer token for authenticated requests
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwtToken);
    }

    @Test
    void createClinic_shouldSucceed_whenValidAdmin() throws Exception {
        // Prepare request
        CreateClinicRequest req = CreateClinicRequest.builder()
                .name("Healing Hands")
                .email("healing@example.com")
                .phoneNumber("0712345678")
                .username("healing_user")
                .password("secure123")
                .build();

        // Create entity with headers
        HttpEntity<String> entity = new HttpEntity<>(new ObjectMapper().writeValueAsString(req), headers);

        // Send POST request
        String url = "http://localhost:" + port + "/api/clinics";
        ResponseEntity<ClinicInfoResponse> response = restTemplate.postForEntity(url, entity, ClinicInfoResponse.class);

        // Assertions
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ClinicInfoResponse body = response.getBody();
        assertThat(body).isNotNull();
        // Field-wise assertions
        assertThat(body.getId()).isNotNull();
        assertThat(body.getName()).isEqualTo("Healing Hands");
        assertThat(body.getEmail()).isEqualTo("healing@example.com");
        assertThat(body.getPhoneNumber()).isEqualTo("0712345678");
        assertThat(body.getCreatedAt()).isNotNull();
    }

}