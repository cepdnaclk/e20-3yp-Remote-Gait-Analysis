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
} from "@mui/icons-material";
import axiosInstance from "../services/axiosInstance";

const PatientTestSessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});

  const fetchSessions = async (page = 0, size = 6, search = "", sort = "startTime", order = "desc") => {
    try {
      setIsLoading(true);
      
      const params = {
        page,
        size,
      };
      
      if (search) {
        params.search = search;
      }
      
      if (sort) {
        params.sort = `${sort},${order}`;
      }

      const response = await axiosInstance.get("/api/test-sessions/me", {
        params,
      });

      const data = response.data;
      setSessions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
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
  }, []);

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

  const handleDownloadReport = async (reportPath, sessionId) => {
    try {
      const response = await axiosInstance.get(reportPath, {
        responseType: 'blob',
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
      console.error("Failed to download report:", err);
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

  const getBalanceScoreColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 75) return "warning";
    return "error";
  };

  if (isLoading && sessions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: "text.primary" }}>
          My Test Sessions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your gait analysis progress and view detailed reports
        </Typography>
      </Box>

      {/* Search and Filter Controls */}
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

      {/* Sessions Grid */}
      <Box sx={{ mb: 4 }}>
        {sessions.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 2 }}>
            <AssessmentIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No test sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Try adjusting your search criteria." : "Your test sessions will appear here once you start."}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sessions.map((session) => (
              <Grid item xs={12} md={6} lg={4} key={session.sessionId}>
                <Card sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3, 
                  borderRadius: 2,
                  transition: "all 0.3s ease-in-out",
                  borderLeft: session.status === "FAILED" 
                    ? "4px solid #ef4444" 
                    : session.status === "COMPLETED"
                    ? "4px solid #10b981"
                    : "4px solid #f59e0b",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ color: "text.primary" }}>
                          Session #{session.sessionId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(session.startTime)}
                        </Typography>
                      </Box>
                      <Chip 
                        label={session.status} 
                        color={getStatusColor(session.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Duration */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Duration: {formatDuration(session.startTime, session.endTime)}
                      </Typography>
                    </Box>

                    {/* Key Metrics */}
                    {session.results && (
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                            <WalkIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="h6" fontWeight="600">
                              {session.results.steps}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Steps
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                            <BalanceIcon color="primary" sx={{ fontSize: 20 }} />
                            <Typography variant="h6" fontWeight="600">
                              {session.results.balanceScore}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Balance
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    {/* Feedback Preview */}
                    {session.feedback && (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: "rgba(59, 130, 246, 0.05)", 
                        borderRadius: 1, 
                        border: "1px solid rgba(59, 130, 246, 0.1)",
                        mb: 2
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <FeedbackIcon sx={{ fontSize: 16, color: "primary.main" }} />
                          <Typography variant="caption" fontWeight="600" color="primary.main">
                            FEEDBACK
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {session.feedback.notes}
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                      {session.results?.pressureResultsPath && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadReport(
                            session.results.pressureResultsPath,
                            session.sessionId
                          )}
                          sx={{ flexGrow: 1 }}
                        >
                          Download Report
                        </Button>
                      )}
                      <IconButton
                        onClick={() => toggleCardExpansion(session.sessionId)}
                        sx={{ 
                          bgcolor: "grey.100",
                          "&:hover": { bgcolor: "grey.200" }
                        }}
                      >
                        {expandedCards[session.sessionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    {/* Detailed View - Collapsible */}
                    <Collapse in={expandedCards[session.sessionId]}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Detailed Analysis
                      </Typography>
                      
                      {session.results && (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                              <Typography variant="caption" fontWeight="600" color="text.secondary">
                                GAIT METRICS
                              </Typography>
                              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={6}>
                                  <Typography variant="body2">
                                    <strong>Cadence:</strong> {session.results.cadence}
                                  </Typography>
                                </Grid>
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
                              </Grid>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                              <Typography variant="caption" fontWeight="600" color="text.secondary">
                                FORCE DISTRIBUTION
                              </Typography>
                              <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
                  </CardContent>
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
            size="large"
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
};

export default PatientTestSessionsList; 