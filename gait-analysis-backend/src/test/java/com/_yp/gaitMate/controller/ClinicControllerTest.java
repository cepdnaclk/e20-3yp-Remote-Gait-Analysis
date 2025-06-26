package com._yp.gaitMate.controller;


import com._yp.gaitMate.controller.config.IntegrationTestSupport;
import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.dto.clinic.ClinicInfoResponse;
import com._yp.gaitMate.dto.clinic.CreateClinicRequest;
import com._yp.gaitMate.mqtt.core.MqttClientProvider;
import com._yp.gaitMate.repository.ClinicRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;

import java.util.Arrays;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_CLASS;


/**
 * Integration tests for ClinicController.
 *
 * ⚠️ Requires the following to be present in test data.sql:
 * - ROLE_ADMIN with username 'admin'
 * - A Clinic entity with ID = 301 (e.g., 'Sunrise Clinic')
 */

@SpringBootTest
@Sql(scripts = "/test-data/clinic-test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = "/test-data/clean.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
class ClinicControllerTest extends IntegrationTestSupport {
    /**
     * This is the test class for POST /api/clinics
     */
    @Nested
    @DisplayName("POST /api/clinics - Create Clinic")
    class CreateClinicTests {

        public static final String PATH = "/api/clinics";

        @Test
        @DisplayName("Should succeed when request is valid and user is ADMIN")
        void createClinic_shouldSucceed_whenRequestIsValidAndUserIsADMIN() throws Exception {
            HttpHeaders adminHeaders = loginAndGetAuthHeaders("admin", "password");


            CreateClinicRequest req = CreateClinicRequest.builder()
                    .name("NewCare Clinic")
                    .email("newcare@example.com")
                    .phoneNumber("0722222222")
                    .username("newcare_user")
                    .password("securepass")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(new ObjectMapper().writeValueAsString(req), adminHeaders);

//            ResponseEntity<String> rawResponse = restTemplate.postForEntity(
//                    getBaseUrl() + PATH,
//                    entity,
//                    String.class // Capture as plain text for debugging
//            );

//            System.out.println("Error Response: " + rawResponse.getBody());
//            System.out.println("Status: " + rawResponse.getStatusCode());

            ResponseEntity<ClinicInfoResponse> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH, entity, ClinicInfoResponse.class
            );

            // Assertions
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

            ClinicInfoResponse body = response.getBody();
            assertThat(body).isNotNull();

            // Field-wise assertions
            assertThat(body.getId()).isNotNull();
            assertThat(body.getName()).isEqualTo("NewCare Clinic");
            assertThat(body.getEmail()).isEqualTo("newcare@example.com");
            assertThat(body.getPhoneNumber()).isEqualTo("0722222222");
            assertThat(body.getCreatedAt()).isNotNull();

        }


        @Test
        @DisplayName("Should fail when clinic name already exists")
        void createClinic_shouldFail_whenClinicNameAlreadyExists() throws Exception {
            HttpHeaders adminHeaders = loginAndGetAuthHeaders("admin", "password");

            // Insert first clinic
            CreateClinicRequest req1 = CreateClinicRequest.builder()
                    .name("DuplicateClinic")
                    .email("cldup1@example.com")
                    .phoneNumber("0700000001")
                    .username("cldup_user1")
                    .password("pass123")
                    .build();

            HttpEntity<String> entity1 = new HttpEntity<>(new ObjectMapper().writeValueAsString(req1), adminHeaders);
            ResponseEntity<ClinicInfoResponse> response1 = restTemplate.postForEntity(getBaseUrl() + PATH, entity1, ClinicInfoResponse.class);

            assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.CREATED);

            // Try to insert another clinic with same name
            CreateClinicRequest req2 = CreateClinicRequest.builder()
                    .name("DuplicateClinic") // same name
                    .email("cldup2@example.com")
                    .phoneNumber("0700000002")
                    .username("cldup_user2")
                    .password("pass123")
                    .build();

            HttpEntity<String> entity2 = new HttpEntity<>(new ObjectMapper().writeValueAsString(req2), adminHeaders);

            ResponseEntity<ApiResponse> response2 = restTemplate.postForEntity(
                    getBaseUrl() + PATH, entity2, ApiResponse.class
            );

            assertEquals(HttpStatus.BAD_REQUEST, response2.getStatusCode());

            ApiResponse body = response2.getBody();
            assertThat(body).isNotNull();

            // Field-wise assertions
            assertThat(body.getMessage()).isEqualTo("Clinic name already exists");
            assertThat(body.getStatus()).isFalse();
        }

        @Test
        @DisplayName("Should fail when user is not authenticated")
        void createClinic_shouldFail_whenUserNotAuthenticated() throws Exception {
            CreateClinicRequest req = CreateClinicRequest.builder()
                    .name("UnauthorizedClinic")
                    .email("clunauth@example.com")
                    .phoneNumber("0777777777")
                    .username("clunauth_user")
                    .password("pass123")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(new ObjectMapper().writeValueAsString(req));

            ResponseEntity<String> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH, entity, String.class
            );

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        @Test
        @DisplayName("Should fail when authenticated user is not admin")
        void createClinic_shouldFail_whenUserIsNotAdmin() throws Exception {
            HttpHeaders clinicHeaders = loginAndGetAuthHeaders("clinic1", "password");

            CreateClinicRequest req = CreateClinicRequest.builder()
                    .name("WrongRoleClinic")
                    .email("wrongrole@example.com")
                    .phoneNumber("0788888888")
                    .username("wrongrole_user")
                    .password("pass123")
                    .build();

            HttpEntity<String> entity = new HttpEntity<>(new ObjectMapper().writeValueAsString(req), clinicHeaders);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    getBaseUrl() + PATH, entity, String.class
            );

            assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        }

    }


    /**
     * This is the test class for GET /api/clinics/{id}
     */
    @Nested
    @DisplayName("GET /api/clinics/{id} - Get clinic by id")
    class GetClinicByIdTests {

        public static final String PATH = "/api/clinics/";

        /**
         * Test expects a clinic with ID = 301 to be preloaded via data.sql.
         * Make sure that this record exists in src/test/resources/data.sql.
         */
        @Test
        @DisplayName("Should return clinic when ID exists and user is authenticated")
        void shouldReturnClinic_whenIdExistsAndAuthenticated() {
            HttpHeaders headers = loginAndGetAuthHeaders("patient1", "password");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = getBaseUrl() + PATH +"301"; // Assuming this clinic exists in data.sql

            ResponseEntity<ClinicInfoResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ClinicInfoResponse.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());

            ClinicInfoResponse body = response.getBody();
            assertThat(body).isNotNull();

            // Field-wise assertions
            assertThat(body.getId()).isEqualTo(301L);
            assertThat(body.getName()).isEqualTo("Sunrise Clinic");
            assertThat(body.getEmail()).isEqualTo("clinic1@example.com");
            assertThat(body.getPhoneNumber()).isEqualTo("0712345000");
            assertThat(body.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should return 404 when clinic ID does not exist")
        void shouldReturn404_whenClinicNotFound() {
            HttpHeaders headers = loginAndGetAuthHeaders("patient1", "password");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = getBaseUrl() + PATH +"9999"; // Non-existent ID

            ResponseEntity<ApiResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ApiResponse.class
            );

            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

            ApiResponse body = response.getBody();
            assertThat(body).isNotNull();

            // Field-wise assertions
            assertThat(body.getMessage()).isEqualTo("Clinic not found with id: 9999");
            assertThat(body.getStatus()).isFalse();
        }

        @Test
        @DisplayName("Should return 401 when user is not authenticated")
        void shouldReturn401_whenNotAuthenticated() {
            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());

            String url = getBaseUrl() + PATH +"301";

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }
    }


    /**
     * This is the test class for GET /api/clinics/me
     */
    @Nested
    @DisplayName("GET /api/clinics/me")
    class GetMyClinicProfileTests {

        public static final String PATH = "/api/clinics/me";

        @Test
        @DisplayName("Should return clinic profile when authenticated as clinic")
        void shouldReturnClinicProfile_whenAuthenticatedAsClinic() {
            HttpHeaders clinicHeaders = loginAndGetAuthHeaders("clinic1", "password");

            HttpEntity<Void> entity = new HttpEntity<>(clinicHeaders);

            String url = getBaseUrl() + PATH;

            ResponseEntity<ClinicInfoResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ClinicInfoResponse.class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());

            ClinicInfoResponse body = response.getBody();
            assertThat(body).isNotNull();

            // Field-wise assertions
            assertThat(body.getId()).isEqualTo(301L);
            assertThat(body.getName()).isEqualTo("Sunrise Clinic");
            assertThat(body.getEmail()).isEqualTo("clinic1@example.com");
            assertThat(body.getPhoneNumber()).isEqualTo("0712345000");
            assertThat(body.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should return 403 when user is not a clinic")
        void shouldReturn403_whenUserIsNotClinic() {
            HttpHeaders adminHeaders = loginAndGetAuthHeaders("admin", "password");

            HttpEntity<Void> entity = new HttpEntity<>(adminHeaders);
            String url = getBaseUrl() + PATH;

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        }

        @Test
        @DisplayName("Should return 401 when user is not authenticated")
        void shouldReturn401_whenNotAuthenticated() {
            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());
            String url = getBaseUrl() + PATH;

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }
    }

    /**
     * This is the test class for GET /api/clinics
     */
    @Nested
    @DisplayName("GET /api/clinics")
    class GetAllClinicsTests {

        public static final String PATH = "/api/clinics";

        @Test
        @DisplayName("Should return all clinics when authenticated as admin")
        void shouldReturnAllClinics_whenAdminAuthenticated() {
            HttpHeaders headers = loginAndGetAuthHeaders("admin", "password");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = getBaseUrl() + PATH;

            ResponseEntity<ClinicInfoResponse[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ClinicInfoResponse[].class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());

            ClinicInfoResponse[] body = response.getBody();
            assertThat(body).isNotNull();
            assertThat(body.length).isGreaterThanOrEqualTo(1);

            // Validate first clinic fields (assuming 301 is in data.sql)
            ClinicInfoResponse clinic = Arrays.stream(body)
                    .filter(c -> c.getId() == 301L)
                    .findFirst()
                    .orElseThrow(() -> new AssertionError("Expected clinic with ID 301 not found"));

            assertThat(clinic.getName()).isEqualTo("Sunrise Clinic");
            assertThat(clinic.getEmail()).isEqualTo("clinic1@example.com");
            assertThat(clinic.getPhoneNumber()).isEqualTo("0712345000");
            assertThat(clinic.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("Should return all clinics when authenticated as clinic")
        void shouldReturnAllClinics_whenClinicAuthenticated() {
            HttpHeaders headers = loginAndGetAuthHeaders("clinic1", "password");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = getBaseUrl() + PATH;

            ResponseEntity<ClinicInfoResponse[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    ClinicInfoResponse[].class
            );

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().length).isGreaterThanOrEqualTo(1);
        }

        @Test
        @DisplayName("Should return 401 when user is not authenticated")
        void shouldReturn401_whenUnauthenticated() {
            HttpEntity<Void> entity = new HttpEntity<>(new HttpHeaders());

            String url = getBaseUrl() + PATH;

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }
    }






    // TODO: Test getMyClinc and getAllClinics endpoints

}