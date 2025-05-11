package com._yp.gaitMate.dto;

//import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//@Schema(description = "Standard response object for API endpoints")
public class ApiResponse {
//    @Schema(description = "Message describing the result of the API call", example = "Successful")
    private String message;

//    @Schema(description = "Status indicating whether the API call was successful (true) or failed (false)", example = "true")
    private boolean status;
}