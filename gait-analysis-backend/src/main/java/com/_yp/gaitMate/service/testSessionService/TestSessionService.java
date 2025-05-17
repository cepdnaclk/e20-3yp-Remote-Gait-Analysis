package com._yp.gaitMate.service.testSessionService;

import com._yp.gaitMate.dto.testSession.TestSessionActionDto;
import com._yp.gaitMate.dto.testSession.StartTestSessionResponse;

public interface TestSessionService {
    StartTestSessionResponse startSession(TestSessionActionDto request);
}
