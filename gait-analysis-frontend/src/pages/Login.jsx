import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form Validation Schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  
  const navigate = useNavigate();

  //const [credentials, setCredentials] = useState({ email: "", password: "" });
  /* 
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulated login (replace this with API call)
    if (credentials.email === "admin@physio.com" && credentials.password === "password") {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  */ 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Handle authentication logic here
    if (data.email === "admin@physio.com" && data.password === "password") {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }

  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, mt: 8, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          🏥 Remote Gait Analysis
        </Typography>
        <Typography variant="h6" align="center" color="primary" gutterBottom>
          Log in to your account
        </Typography>
        
        {/* Attach correct onSubmit handler */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"

            /* 
            variant="outlined"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            */
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            /* 
            variant="outlined"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            */
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
