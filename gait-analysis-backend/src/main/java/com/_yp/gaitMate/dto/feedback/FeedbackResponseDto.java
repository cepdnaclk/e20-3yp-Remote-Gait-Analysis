package com._yp.gaitMate.dto.feedback;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDto {

    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
