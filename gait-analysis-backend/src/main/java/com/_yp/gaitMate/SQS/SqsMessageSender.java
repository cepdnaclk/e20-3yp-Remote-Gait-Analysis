package com._yp.gaitMate.SQS;

import com._yp.gaitMate.dto.testSession.ProcessingRequestDto;
import io.awspring.cloud.sqs.operations.SendResult;
import io.awspring.cloud.sqs.operations.SqsTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class SqsMessageSender {

    private final SqsTemplate sqsTemplate;

    @Value("${app.sqs.queue-name}")
    private String queueName;

    public void sendProcessingRequest(ProcessingRequestDto request) {
        try {
            SendResult<ProcessingRequestDto> sendResult = sqsTemplate.send(options ->
                    options.queue(queueName).payload(request));

            UUID messageId = sendResult.messageId();
            String endpoint = sendResult.endpoint();

            log.info("✅ SQS Message sent: [sessionId={}, messageId={}, endpoint={}]",
                    request.getSessionId(), messageId, endpoint);

        } catch (Exception e) {
            log.error("❌ Failed to send SQS message for sessionId={}", request.getSessionId(), e);
        }
    }

}
