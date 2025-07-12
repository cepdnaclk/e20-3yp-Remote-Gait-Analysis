import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { getAppointmentDetails } from "../services/doctorServices";

const AppointmentCard = ({
  appointment,
  type,
  onAccept,
  onReject,
  onReschedule,
  onAddNote,
}) => {
  const { id, patientName, startTime, reason, status, notes } = appointment;

  const [rescheduleTime, setRescheduleTime] = useState("");
  const [note, setNote] = useState(notes || "");
  const [showRescheduleInput, setShowRescheduleInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [details, setDetails] = useState(null);

  const handleReschedule = () => {
    onReschedule(id, rescheduleTime);
    setShowRescheduleInput(false);
  };

  const handleAddNote = () => {
    onAddNote(id, note);
    setShowNoteInput(false);
  };

  const handleViewDetails = async () => {
    setDetailsOpen(true);
    setLoadingDetails(true);
    try {
      const response = await getAppointmentDetails(id);
      setDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch appointment details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">{patientName}</Typography>
            <Chip label={status || type.toUpperCase()} color="primary" />
          </Box>

          <Typography variant="body2" color="text.secondary">
            🕒 {new Date(startTime).toLocaleString()}
          </Typography>

          {reason && (
            <Typography variant="body2" mt={1}>
              💬 {reason}
            </Typography>
          )}

          <Box mt={2}>
            {type === "pending" && (
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="success" onClick={() => onAccept(id)}>
                  Accept
                </Button>
                <Button variant="outlined" color="error" onClick={() => onReject(id)}>
                  Reject
                </Button>
                <Button
                  variant="text"
                  onClick={() => setShowRescheduleInput(!showRescheduleInput)}
                >
                  Reschedule
                </Button>
              </Stack>
            )}

            {type === "upcoming" && (
              <Button variant="contained" color="primary" onClick={handleViewDetails}>
                View Details
              </Button>
            )}

            {type === "history" && (
              <Button variant="outlined" onClick={() => setShowNoteInput(!showNoteInput)}>
                {notes ? "Edit Note" : "Add Note"}
              </Button>
            )}
          </Box>

          {showRescheduleInput && (
            <Box mt={2}>
              <TextField
                type="datetime-local"
                label="New Time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" onClick={handleReschedule}>
                Confirm Reschedule
              </Button>
            </Box>
          )}

          {showNoteInput && (
            <Box mt={2}>
              <TextField
                label="Feedback Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" onClick={handleAddNote}>
                Save Note
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : details ? (
            <Box>
              <Typography><strong>Patient:</strong> {details.patientName}</Typography>
              <Typography><strong>Email:</strong> {details.email}</Typography>
              <Typography><strong>Start Time:</strong> {new Date(details.startTime).toLocaleString()}</Typography>
              <Typography><strong>Duration:</strong> {details.durationMinutes} mins</Typography>
              <Typography><strong>Status:</strong> {details.status}</Typography>
              {details.reason && (
                <Typography><strong>Reason:</strong> {details.reason}</Typography>
              )}
              {details.notes && (
                <Typography><strong>Notes:</strong> {details.notes}</Typography>
              )}
              <Typography><strong>Created By:</strong> {details.createdBy}</Typography>
              <Typography><strong>Clinic:</strong> {details.clinicName}</Typography>
            </Box>
          ) : (
            <Typography>Error loading details.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentCard;
