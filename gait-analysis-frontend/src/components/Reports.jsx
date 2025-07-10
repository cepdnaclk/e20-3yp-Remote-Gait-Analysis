import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  DirectionsWalk as WalkIcon,
  Speed as SpeedIcon,
  Balance as BalanceIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  Feedback as FeedbackIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import axiosInstance from "../services/axiosInstance";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, COMPLETED, REVIEWED

  const fetchReports = async (page = 0, size = 10, search = "", sort = "startTime", order = "desc", status = "ALL") => {
    try {
      setIsLoading(true);
      
      // Build query parameters
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

      // Add status filter if not ALL
      if (status !== "ALL") {
        params.status = status;
      }

      const response = await axiosInstance.get("/api/test-sessions/doctors/me/reports", {
        params,
      });

      const data = response.data;
      setReports(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page + 1);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0, pageSize, searchTerm, sortBy, sortOrder, statusFilter);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchReports(0, pageSize, value, sortBy, sortOrder, statusFilter);
  };

  const handleSortChange = (newSortBy) => {
    const newOrder = sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    fetchReports(currentPage - 1, pageSize, searchTerm, newSortBy, newOrder, statusFilter);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    fetchReports(newPage - 1, pageSize, searchTerm, sortBy, sortOrder, statusFilter);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchReports(0, newSize, searchTerm, sortBy, sortOrder, statusFilter);
  };

  const handleStatusFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
      setCurrentPage(1);
      fetchReports(0, pageSize, searchTerm, sortBy, sortOrder, newFilter);
    }
  };

  const handleDownloadReport = async (reportURL, patientName, sessionId) => {
    try {
      const response = await axiosInstance.get(reportURL, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const filename = `${patientName.replace(/\s+/g, '_')}_Session_${sessionId}_Report.pdf`;
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

  const handleReportClick = (sessionId) => {
    navigate(`/doctor/test-session-review/${sessionId}`);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getBalanceScoreColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 75) return "warning";
    return "error";
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "REVIEWED":
        return {
          color: "success",
          bgColor: "#e8f5e8",
          borderColor: "#4caf50",
          icon: <CheckCircleIcon fontSize="small" />,
          text: "Reviewed"
        };
      case "COMPLETED":
        return {
          color: "warning",
          bgColor: "#fff3e0",
          borderColor: "#ff9800", 
          icon: <PendingActionsIcon fontSize="small" />,
          text: "Pending Review"
        };
      default:
        return {
          color: "default",
          bgColor: "#f5f5f5",
          borderColor: "#ccc",
          icon: <PendingActionsIcon fontSize="small" />,
          text: status
        };
    }
  };

  const getReportCounts = () => {
    // This would ideally come from a separate API call or be included in the main response
    // For now, we'll show the current filter results
    const reviewed = reports.filter(r => r.status === "REVIEWED").length;
    const pending = reports.filter(r => r.status === "COMPLETED").length;
    return { reviewed, pending, total: reports.length };
  };

  if (isLoading && reports.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load reports: {error}
      </Alert>
    );
  }

  const counts = getReportCounts();

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Patient Reports
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: "#e8f5e8", 
            border: "1px solid #4caf50",
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="#2e7d32">
                {statusFilter === "REVIEWED" ? totalElements : counts.reviewed}
              </Typography>
              <Typography variant="body2" color="#2e7d32">
                Reviewed Reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: "#fff3e0", 
            border: "1px solid #ff9800",
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              <PendingActionsIcon sx={{ color: "#ff9800", fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="#e65100">
                {statusFilter === "COMPLETED" ? totalElements : counts.pending}
              </Typography>
              <Typography variant="body2" color="#e65100">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            bgcolor: "#e3f2fd", 
            border: "1px solid #2196f3",
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2, textAlign: "center" }}>
              <NotesIcon sx={{ color: "#2196f3", fontSize: 32, mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="#1565c0">
                {statusFilter === "ALL" ? totalElements : totalElements}
              </Typography>
              <Typography variant="body2" color="#1565c0">
                Total Reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by patient name..."
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
          
          {/* Status Filter */}
          <Grid item xs={12} md={3}>
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              size="small"
              fullWidth
            >
              <ToggleButton value="ALL" sx={{ textTransform: "none" }}>
                All
              </ToggleButton>
              <ToggleButton value="COMPLETED" sx={{ textTransform: "none" }}>
                Pending
              </ToggleButton>
              <ToggleButton value="REVIEWED" sx={{ textTransform: "none" }}>
                Reviewed
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <MenuItem value="startTime">Test Date</MenuItem>
                <MenuItem value="patientName">Patient Name</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="balanceScore">Balance Score</MenuItem>
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
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {reports.length} of {totalElements} reports
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports List */}
      <Box sx={{ mb: 3 }}>
        {reports.length === 0 ? (
          <Alert severity="info">
            No reports found. {searchTerm && "Try adjusting your search criteria."}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {reports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              return (
                <Grid item xs={12} key={report.sessionId}>
                  <Card sx={{ 
                    mb: 3, 
                    boxShadow: 3, 
                    borderRadius: 2,
                    bgcolor: statusConfig.bgColor,
                    border: `2px solid ${statusConfig.borderColor}`,
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => handleReportClick(report.sessionId)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div">
                            {report.patientName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Session ID: {report.sessionId} • Patient ID: {report.patientId}
                          </Typography>
                        </Box>
                        
                        {/* Status Chip */}
                        <Box sx={{ mr: 2 }}>
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.text}
                            color={statusConfig.color}
                            variant="filled"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: "0.8rem"
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ textAlign: "right", mr: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(report.startTime)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {formatDuration(report.results.durationSeconds)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleDownloadReport(
                                report.results.reportURL, 
                                report.patientName, 
                                report.sessionId
                              );
                            }}
                            sx={{ 
                              fontWeight: "bold",
                              px: 3,
                              py: 1,
                              "&:hover": { 
                                transform: "scale(1.02)",
                                boxShadow: 4 
                              }
                            }}
                          >
                            Download Report
                          </Button>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              toggleCardExpansion(report.sessionId);
                            }}
                            sx={{ 
                              ml: 1,
                              bgcolor: "grey.100",
                              "&:hover": { bgcolor: "grey.200" }
                            }}
                          >
                            {expandedCards[report.sessionId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Feedback Section - Show if available */}
                      {report.feedback?.notes && (
                        <Paper sx={{ 
                          p: 2, 
                          mb: 2, 
                          bgcolor: "rgba(63, 81, 181, 0.08)",
                          borderLeft: "4px solid #3f51b5"
                        }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <FeedbackIcon sx={{ color: "#3f51b5", mr: 1 }} />
                            <Typography variant="subtitle2" fontWeight={600} color="#3f51b5">
                              Doctor's Feedback
                            </Typography>
                            {report.feedback.updatedAt && (
                              <Chip 
                                label={`Updated: ${formatDateTime(report.feedback.updatedAt)}`}
                                size="small"
                                variant="outlined"
                                sx={{ ml: 2, fontSize: "0.7rem" }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                            "{report.feedback.notes}"
                          </Typography>
                        </Paper>
                      )}

                      {/* Summary Stats */}
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <WalkIcon color="primary" />
                            <Typography variant="h6">{report.results.steps}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Steps
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <SpeedIcon color="primary" />
                            <Typography variant="h6">{report.results.cadence}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Cadence
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <BalanceIcon color="primary" />
                            <Box sx={{ my: 1 }}>
                              <Chip
                                label={report.results.balanceScore}
                                color={getBalanceScoreColor(report.results.balanceScore)}
                                variant="filled"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Balance Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: "center" }}>
                            <TimelineIcon color="primary" />
                            <Typography variant="h6">{report.results.peakImpact}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Peak Impact
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Detailed Results - Collapsible */}
                      <Collapse in={expandedCards[report.sessionId]}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Detailed Analysis
                        </Typography>
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                Force Distribution
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2">Heel:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {report.results.avgForce.heel}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2">Toe:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {report.results.avgForce.toe}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2">Midfoot:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {report.results.avgForce.midfoot}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                Gait Timing
                              </Typography>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2">Avg Swing Time:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {report.results.avgSwingTime}s
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2">Avg Stance Time:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {report.results.avgStanceTime}s
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                Stride Times (Last 10)
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {report.results.strideTimes.map((time, index) => (
                                  <Chip
                                    key={index}
                                    label={`${time}s`}
                                    variant="outlined"
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
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
          />
        </Box>
      )}

      {/* Loading Overlay */}
      {isLoading && reports.length > 0 && (
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

export default Reports;