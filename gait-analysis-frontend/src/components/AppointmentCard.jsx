import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Stack
} from "@mui/material";

const AppointmentCard = ({
  appointment,
  type,
  onAccept,
  onReject,
  onReschedule,
  onAddNote,
}) => {
  const {
    id,
    patientName,
    startTime,
    reason,
    status,
    notes
  } = appointment;

  const [rescheduleTime, setRescheduleTime] = useState("");
  const [note, setNote] = useState(notes || "");
  const [showRescheduleInput, setShowRescheduleInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleReschedule = () => {
    onReschedule(id, rescheduleTime);
    setShowRescheduleInput(false);
  };

  const handleAddNote = () => {
    onAddNote(id, note);
    setShowNoteInput(false);
  };

  return (
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
          {/* Conditional Buttons */}
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
            <Button variant="contained" color="primary">
              View Details
            </Button>
          )}

          {type === "history" && (
            <Button variant="outlined" onClick={() => setShowNoteInput(!showNoteInput)}>
              {notes ? "Edit Note" : "Add Note"}
            </Button>
          )}
        </Box>

        {/* Inline Reschedule Form */}
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

        {/* Inline Note Form */}
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
  );
};

export default AppointmentCard;
