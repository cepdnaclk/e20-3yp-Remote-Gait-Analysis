package com._yp.gaitMate.dto.feedback;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDto {

    @NotBlank(message = "Feedback comments must not be blank")
    private String comments;
}
