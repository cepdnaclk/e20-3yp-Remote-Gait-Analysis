package com._yp.gaitMate.service.reportDownloadSerivce;

public interface ReportDownloadService {
    byte[] downloadReportForSession(Long sessionId);
    String getReportFileNameForSession(Long sessionId);
    //boolean refreshPresignedUrl(Long sessionId);

}
