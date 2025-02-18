import { usePatients } from "../api/patients";
import { CircularProgress, Typography, Box, Grid, Paper } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";


export default function Dashboard() {
  const [patients, setPatients] = useState(null);

  useEffect(() => {
    // Simulating a delay (API response)
    setTimeout(() => {
      setPatients([
        { id: 1, name: "John Doe", age: 45 },
        { id: 2, name: "Jane Smith", age: 38 },
      ]);
    }, 1000);
  }, []);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        🏥 Gait Analysis Dashboard
      </Typography>

      {/* Loading & Error Handling */}
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Error: {error.message}</Typography>}

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ padding: 3, display: "flex", alignItems: "center" }}>
            <PeopleIcon sx={{ fontSize: 40, marginRight: 2 }} />
            <Box>
              <Typography variant="h6">Total Patients</Typography>
              <Typography variant="h4">{patients ? patients.length : 0}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Additional summary cards can go here */}
      </Grid>

      {/* Patient List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          👤 Recent Patients
        </Typography>
        {patients?.map((patient) => (
          <Paper key={patient.id} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">{patient.name}</Typography>
            <Typography color="text.secondary">Age: {patient.age}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
