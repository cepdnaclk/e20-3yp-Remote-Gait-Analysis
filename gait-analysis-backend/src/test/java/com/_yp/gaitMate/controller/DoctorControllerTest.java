package com._yp.gaitMate.controller;

import com._yp.gaitMate.controller.config.IntegrationTestSupport;
import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.doctor.CreateDoctorRequest;
import com._yp.gaitMate.dto.doctor.DoctorInfoResponse;
import com._yp.gaitMate.mqtt.core.MqttClientProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.*;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Sql(scripts = "/test-data/doctor-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = "/test-data/clean.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
class DoctorControllerTest extends IntegrationTestSupport {

    @Nested
    @DisplayName("POST /api/doctors - Create Doctor")
    class CreateDoctorTests {
        private static final String PATH = "/api/doctors";

        @Test
        @DisplayName("Should succeed when request is valid and user is CLINIC")
        void createDoctor_shouldSucceed_whenRequestIsValidAndUserIsClinic() throws JsonProcessingException {
            HttpHeaders clinicHeaders = loginAndGetAuthHeaders("clinic1", "password");

            String suffix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

            CreateDoctorRequest request = CreateDoctorRequest.builder()
                    .name("Dr. Thilini " + suffix)
                    .email("yohansenanayake4321@gmail.com")
                    .phoneNumber("0779333333") // Unique
                    .specialization("Physiotherapist")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(
                    new ObjectMapper().writeValueAsString(request),
                    clinicHeaders
            );

            ResponseEntity<DoctorInfoResponse> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH,
                    entity,
                    DoctorInfoResponse.class
            );

            assertEquals(HttpStatus.CREATED, response.getStatusCode());

            DoctorInfoResponse body = response.getBody();
            assertThat(body).isNotNull();
            assertThat(body.getId()).isNotNull();
            assertThat(body.getName()).isEqualTo(request.getName());
            assertThat(body.getEmail()).isEqualTo(request.getEmail());
            assertThat(body.getPhoneNumber()).isEqualTo(request.getPhoneNumber());
            assertThat(body.getSpecialization()).isEqualTo(request.getSpecialization());
            assertThat(body.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should fail when user is not authenticated")
        void createDoctor_shouldFail_whenUserNotAuthenticated() throws Exception {
            CreateDoctorRequest request = CreateDoctorRequest.builder()
                    .name("Dr. Ghost")
                    .email("ghost@example.com")
                    .phoneNumber("0700000000")
                    .specialization("Neurology")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(
                    new ObjectMapper().writeValueAsString(request)
            );

            ResponseEntity<String> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        @Test
        @DisplayName("Should fail when user is not a CLINIC")
        void createDoctor_shouldFail_whenUserIsNotClinic() throws Exception {
            HttpHeaders adminHeaders = loginAndGetAuthHeaders("admin", "password");

            CreateDoctorRequest request = CreateDoctorRequest.builder()
                    .name("Dr. Unauthorized")
                    .email("drunauth@example.com")
                    .phoneNumber("0788888888")
                    .specialization("Cardiology")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(
                    new ObjectMapper().writeValueAsString(request),
                    adminHeaders
            );

            ResponseEntity<String> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        }

        @Test
        @DisplayName("Should fail when doctor name already exists")
        void createDoctor_shouldFail_whenDoctorNameAlreadyExists() throws Exception {
            HttpHeaders clinicHeaders = loginAndGetAuthHeaders("clinic1", "password");

            // First request
            CreateDoctorRequest req1 = CreateDoctorRequest.builder()
                    .name("Dr. Duplicate")
                    .email("yohansenanayake4321@gmail.com")
                    .phoneNumber("0700000001")
                    .specialization("Rehab")
                    .build();

            HttpEntity<String> entity1 = new HttpEntity<>(new ObjectMapper().writeValueAsString(req1), clinicHeaders);

//            ResponseEntity<DoctorInfoResponse> response1 = restTemplate.postForEntity(getBaseUrl() + PATH, entity1, DoctorInfoResponse.class);
//            assertEquals(HttpStatus.CREATED, response1.getStatusCode());

            ResponseEntity<String> rawResponse = restTemplate.postForEntity(
                    getBaseUrl() + PATH,
                    entity1,
                    String.class // Capture as plain text for debugging
            );
            System.out.println(rawResponse);
            System.out.println(rawResponse.getStatusCode());

            // Second request (same name)
            CreateDoctorRequest req2 = CreateDoctorRequest.builder()
                    .name("Dr. Duplicate") // same name
                    .email("yohansenanayake4321@gmail.com")
                    .phoneNumber("0700000002")
                    .specialization("Rehab")
                    .build();

            HttpEntity<String> entity2 = new HttpEntity<>(new ObjectMapper().writeValueAsString(req2), clinicHeaders);
            ResponseEntity<ApiResponse> response2 = restTemplate.postForEntity(getBaseUrl() + PATH, entity2, ApiResponse.class);

            assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());
            assertThat(response2.getBody()).isNotNull();
            assertThat(response2.getBody().getMessage()).isEqualTo("Doctor name already exists");
            assertThat(response2.getBody().getStatus()).isFalse();
        }
    }
}
