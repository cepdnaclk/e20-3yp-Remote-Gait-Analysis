import { Avatar, Box, Button, Divider, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";


export default function PatientSidebar({ patient }) {
    return (
        <Paper sx={{width:300, padding:3, borderRadius:3}}>
            {/* Patient Info */}
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"} >
                <Avatar src={patient.photo} sx={{width:80, height:80, mb:2}} />
                <Typography variant="h6">{patient.name}</Typography>
                <Typography color="text.secondary">Patient ID: {patient.id}</Typography>
                <Typography color="text.secondary">{patient.age} years (DOB: {patient.dob})</Typography>
                <Typography color="text.secondary">{patient.phone}</Typography>
                <Typography color="text.secondary">{patient.email}</Typography>

                <Box mt={2} display={"flex"} gap={1}>
                    <Button variant="contained" startIcon={<EditIcon/>} size="small">Edit Profile</Button>
                    <Button variant="outlined" startIcon={<EventIcon/>} size="small">Schedule</Button>
                </Box>
            </Box>

            <Divider sx={{my:2}} />

            {/* Health Info of the patient */}
            <Typography variant="subtitle1" fontWeight="bold">Health Information</Typography>
            <Typography color="text.secondary">Height: {patient.height} cm</Typography>
            <Typography color="text.secondary">Weight: {patient.weight} kg</Typography>
            <Typography color="text.secondary">BMI: {patient.bmi}</Typography>

            <Divider sx={{my:2}} />

            {/* Primary Conditions */}
            <Typography variant="subtitle1" fontWeight="bold">Primary Conditions</Typography>
            <List dense>
                {patient?.conditions?.length > 0 ? (
                    patient.conditions.map((condition, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={condition} primaryTypographyProps={{ color: "primary" }} />
                        </ListItem>
                    ))
                ) : (
                    <Typography color="text.secondary">No conditions listed</Typography>
                )}
            </List>

            <Divider sx={{my:2}} />

            {/* Medications */}
            {/* Current Treatment Plan */}
            <Typography variant="subtitle1" fontWeight="bold">Current Treatment Plan</Typography>
            <List dense>
                {patient?.treatmentPlan?.length > 0 ? (
                    patient.treatmentPlan.map((treatment, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={treatment} />
                        </ListItem>
                    ))
                ) : (
                    <Typography color="text.secondary">No treatment plan listed</Typography>
                )}
            </List>



        </Paper>
    );
}
        
        