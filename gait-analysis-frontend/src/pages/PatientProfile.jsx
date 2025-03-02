import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { usePatients } from "../api/patients";
import PatientSidebar from "../components/PatientSidebar";
import { useNavigate } from "react-router-dom";

export default function PatientProfile() {
    const { id } = useParams(); // Get the patient ID from the URL
    const { data: patients, isLoading, error } = usePatients();
    const navigate = useNavigate();

    if (isLoading) return <Typography>Loading Patient Data...</Typography>;
    if (error) return <Typography color="error">Error loading patient data</Typography>;

    // Find patient by ID
    const patient = patients.find((p) => p.id === Number(id));
    if (!patient) return <Typography color="error">Patient not found</Typography>;

    // Mock data for Appointments & Reports (Replace with API data)
    const reportHistory = [
        { id: 1, date: "2025-02-20", status: "Reviewed" },
        { id: 2, date: "2025-02-10", status: "Pending" },
        { id: 3, date: "2025-01-30", status: "Reviewed" },
    ];

    const appointmentHistory = [
        { id: 1, date: "2025-02-25", doctor: "Dr. Keerthi Ilukkumbura", status: "Completed" },
        { id: 2, date: "2025-02-15", doctor: "Dr. Amal Perera", status: "Cancelled" },
        { id: 3, date: "2025-01-28", doctor: "Dr. Keerthi Ilukkumbura", status: "Completed" },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                background: "radial-gradient(circle,rgb(6, 40, 97), rgb(28, 32, 57))",
                padding: 3,
                color: "white",
                overflowY: "auto",
            }}
        >
            {/* Left Sidebar */}
            <PatientSidebar patient={patient} />

            {/* Right Content */}
            <Box sx={{ flexGrow: 1, marginLeft: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Patient Profile
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    Welcome back, Dr. Keerthi Ilukkumbura
                </Typography>

                {/* Top Summary Cards */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(10px)",
                                borderRadius: 3,
                                boxShadow: 3,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6">Total Appointments</Typography>
                            <Typography variant="h4">12</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(10px)",
                                borderRadius: 3,
                                boxShadow: 3,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6">Total Reports</Typography>
                            <Typography variant="h4">8</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Paper
                            sx={{
                                padding: 3,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(10px)",
                                borderRadius: 3,
                                boxShadow: 3,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6">Next Appointment</Typography>
                            <Typography variant="h4">2025-03-05</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Real-time Dashboard Section */}
                <Paper
                    sx={{
                        padding: 3,
                        mt: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        boxShadow: 3,
                        color: "white",
                    }}
                >
                    <Typography variant="h6">Real-time Dashboard</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Monitor patient activity and track real-time gait analysis data.
                    </Typography>
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate(`/patients/${id}/realtime`)}
                        >
                            View Dashboard
                        </Button>
                    </Box>
                </Paper>

                {/* Report History Table */}
                <Paper
                    sx={{
                        padding: 3,
                        mt: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        boxShadow: 3,
                        color: "white",
                    }}
                >
                    <Typography variant="h6">Report History</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportHistory.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell sx={{ color: "white" }}>{report.date}</TableCell>
                                        <TableCell sx={{ color: "white" }}>{report.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Appointment History Table */}
                <Paper
                    sx={{
                        padding: 3,
                        mt: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 3,
                        boxShadow: 3,
                        color: "white",
                    }}
                >
                    <Typography variant="h6">Appointment History</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Doctor</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentHistory.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell sx={{ color: "white" }}>{appointment.date}</TableCell>
                                        <TableCell sx={{ color: "white" }}>{appointment.doctor}</TableCell>
                                        <TableCell sx={{ color: "white" }}>{appointment.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" color="primary">
                            Add New Appointment
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
