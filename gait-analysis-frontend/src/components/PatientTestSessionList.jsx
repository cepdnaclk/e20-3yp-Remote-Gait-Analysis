import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  DirectionsWalk as WalkIcon,
  Speed as SpeedIcon,
  Balance as BalanceIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Feedback as FeedbackIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { getMyTestSessions } from "../services/patientServices"; // Use your existing service
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

import axiosInstance from "../services/axiosInstance";

const PatientTestSessionsList = forwardRef(({ 
  embedded = false, // New prop to control if it's embedded in dashboard
  initialPageSize = 12,
  showControls = true, // Whether to show search/filter controls
  title = "Session History"
}, ref) => {
  const navigate = useNavigate();
  const sessionRefs = useRef({}); // map of sessionId => element

  // 👇 expose method to parent via ref
  useImperativeHandle(ref, () => ({
    scrollToSession: (sessionId) => {
      const el = sessionRefs.current[sessionId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("highlighted-session");
        setTimeout(() => el.classList.remove("highlighted-session"), 1500);
      }
    },
    navigateToSession: (sessionId) => {
      navigate(`/patient/test-session/${sessionId}`);
    }
  }));

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});

  const fetchSessions = async (page = 0, size = pageSize, search = "", sort = "startTime", order = "desc") => {
    try {
      setIsLoading(true);
      
      // Use your existing service - modify it to accept pagination params
      const response = await getMyTestSessions({
        page,
        size,
        search: search || undefined,
        sort: sort ? `${sort},${order}` : undefined,
      });

      // Handle the new paginated response structure
      const data = response.data;
      setSessions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page + 1);
    } catch (err) {
      console.error("Failed to fetch test sessions:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(0, pageSize, searchTerm, sortBy, sortOrder);
  }, [pageSize]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchSessions(0, pageSize, value, sortBy, sortOrder);
  };

  const handleSortChange = (newSortBy) => {
    const newOrder = sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    fetchSessions(currentPage - 1, pageSize, searchTerm, newSortBy, newOrder);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchSessions(newPage - 1, pageSize, searchTerm, sortBy, sortOrder);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchSessions(0, newSize, searchTerm, sortBy, sortOrder);
  };



const handleDownloadReport = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/api/sessions/${sessionId}/download-report`, {
      responseType: 'blob',  // Required for downloading binary files
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const filename = `Session_${sessionId}_Report.pdf`;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Failed to download report:", err);
    alert("Failed to download report. Please try again.");
  }
};



  const toggleCardExpansion = (sessionId) => {
    setExpandedCards(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED": return "success";
      case "IN_PROGRESS": return "warning";
      case "FAILED": return "error";
      default: return "default";
    }
  };

  if (isLoading && sessions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading test sessions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load test sessions: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      p: embedded ? 0 : 3, 
      backgroundColor: embedded ? "transparent" : "#f8fafc", 
      minHeight: embedded ? "auto" : "100vh" 
    }}>
      {/* Header - only show if not embedded */}
      {!embedded && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: "text.primary" }}>
            My Test Sessions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your gait analysis progress and view detailed reports
          </Typography>
        </Box>
      )}

      {/* Embedded header for dashboard */}
      {embedded && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Box 
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
            }}
          >
            <HistoryIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="700" sx={{ color: "text.primary" }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your progress over time
            </Typography>
          </Box>
        </Box>
      )}

      {/* Search and Filter Controls - conditional */}
      {showControls && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <MenuItem value="startTime">Test Date</MenuItem>
                  <MenuItem value="balanceScore">Balance Score</MenuItem>
                  <MenuItem value="steps">Steps</MenuItem>
                  <MenuItem value="cadence">Cadence</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={pageSize}
                  label="Per Page"
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                >
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Showing {sessions.length} of {totalElements} sessions
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Sessions Grid - Modified for wider cards */}
      <Box sx={{ mb: 4 }}>
        {sessions.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: "center",
              background: "rgba(148, 163, 184, 0.05)",
              border: "1px dashed rgba(148, 163, 184, 0.3)",
              borderRadius: 2,
            }}
          >
            <AssessmentIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Try adjusting your search criteria." : "Your test sessions will appear here once you start."}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {sessions.map((session) => (
              <Grid item xs={12} key={session.sessionId}>
                <Card
                  ref={(el) => {
                    if (el) sessionRefs.current[session.sessionId] = el;
                  }}
                  onClick = {() => navigate(`/patient/test-session/${session.sessionId}`)}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    borderLeft: session.status === "FAILED" 
                      ? "4px solid #ef4444" 
                      : session.status === "COMPLETED"
                      ? "4px solid #10b981"
                      : "4px solid #f59e0b",
                    backgroundColor: session.status === "FAILED" 
                      ? "rgba(239, 68, 68, 0.05)" 
                      : "white",
                    "&:hover": { 
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                      borderColor: session.status === "FAILED" 
                        ? "#ef4444" 
                        : session.status === "COMPLETED"
                        ? "#10b981"
                        : "#f59e0b",
                    },
                  }}
                >
                  {/* Header Row */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="700" sx={{ color: "text.primary" }}>
                        Session #{session.sessionId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(session.startTime)} • Duration: {formatDuration(session.startTime, session.endTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip 
                        label={session.status} 
                        color={getStatusColor(session.status)}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: 11 }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardExpansion(session.sessionId);
                        }}
                        sx={{ 
                          bgcolor: "grey.100",
                          "&:hover": { bgcolor: "grey.200" }
                        }}
                      >
                        {expandedCards[session.sessionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Metrics Row */}
                  {session.results && (
                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <WalkIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            STEPS
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {session.results.steps}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BalanceIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            BALANCE SCORE
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {session.results.balanceScore}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SpeedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            CADENCE
                          </Typography>
                          <Typography variant="body1" fontWeight="600">
                            {session.results.cadence}
                          </Typography>
                        </Box>
                      </Box>
                      {session.results?.pressureResultsPath && (
                        <Box sx={{ ml: "auto" }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(session.sessionId);
                            }}  

                          >
                            Download Report
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Feedback Preview */}
                  {session.feedback && (
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontStyle: "italic",
                      backgroundColor: "rgba(148, 163, 184, 0.05)",
                      p: 1.5,
                      borderRadius: 1,
                      border: "1px solid rgba(148, 163, 184, 0.1)",
                      display: "-webkit-box",
                      WebkitLineClamp: expandedCards[session.sessionId] ? "none" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {session.feedback.notes}
                    </Typography>
                  )}

                  {/* Detailed View - Collapsible */}
                  <Collapse in={expandedCards[session.sessionId]}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Detailed Analysis
                    </Typography>
                    
                    {session.results && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                            <Typography variant="caption" fontWeight="600" color="text.secondary">
                              GAIT METRICS
                            </Typography>
                            <Grid container spacing={1} sx={{ mt: 0.5 }}>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Peak Impact:</strong> {session.results.peakImpact}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Swing Time:</strong> {session.results.avgSwingTime}s
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Stance Time:</strong> {session.results.avgStanceTime}s
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Duration:</strong> {session.results.durationSeconds}s
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                            <Typography variant="caption" fontWeight="600" color="text.secondary">
                              FORCE DISTRIBUTION
                            </Typography>
                            <Grid container spacing={1} sx={{ mt: 0.5 }}>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Heel:</strong> {session.results.avgForce.heel}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Toe:</strong> {session.results.avgForce.toe}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  <strong>Midfoot:</strong> {session.results.avgForce.midfoot}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>

                        {session.feedback && (
                          <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: "rgba(59, 130, 246, 0.05)" }}>
                              <Typography variant="caption" fontWeight="600" color="primary.main">
                                COMPLETE FEEDBACK
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {session.feedback.notes}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                {formatDateTime(session.feedback.createdAt)}
                              </Typography>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size={embedded ? "medium" : "large"}
          />
        </Box>
      )}

      {/* Loading Overlay */}
      {isLoading && sessions.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        </Box>
      )}
    </Box>
  );
});

export default PatientTestSessionsList;