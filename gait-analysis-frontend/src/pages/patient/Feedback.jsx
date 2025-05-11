import { Box, Typography, Paper } from "@mui/material";

export default function Feedback() {
  const feedbackNotes = [
    {
      date: "2025-02-20",
      doctor: "Dr. Keerthi Ilukkumbura",
      note: "Improved left foot control. Focus more on heel strike phase.",
    },
    {
      date: "2025-01-30",
      doctor: "Dr. Amal Perera",
      note: "Try balancing exercises. Reduce walk assist reliance.",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Feedback
      </Typography>

      {feedbackNotes.map((fb, i) => (
        <Paper key={i} sx={{ p: 2, my: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {fb.date} — {fb.doctor}
          </Typography>
          <Typography>{fb.note}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
