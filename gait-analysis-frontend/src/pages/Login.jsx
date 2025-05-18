import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Stack, CssBaseline, Divider, FormLabel, FormControl, Link } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import BASE_URL from '../config';


// Form Validation Schema
//const schema = z.object({
  //email: z.string().email("Invalid email format"),
  //password: z.string().min(6, "Password must be at least 6 characters"),
//});

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '350px',
  },
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  background: 'radial-gradient(circle,rgb(6, 40, 97), rgb(28, 32, 57))',
}));

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

const onSubmit = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
      username: data.username,
      password: data.password
    });
  
    
  
    // Save to localStorage
    const { jwtToken: token, roles} = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("roles", JSON.stringify(roles));
  
    // Redirect based on role
    if (roles.includes("ROLE_ADMIN")) navigate("/root/dashboard");
    else if (roles.includes("ROLE_CLINIC_ADMIN")) navigate("/clinic/dashboard");
    else if (roles.includes("ROLE_DOCTOR")) navigate("/doctor/dashboard");
    else if (roles.includes("ROLE_PATIENT")) navigate("/patient/dashboard");
    else alert("Unknown role, access denied");
  
  } catch (err) {
    console.error(err);
    alert("Invalid login. Check username and password.");
  }
};
  

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <LoginContainer direction={'column'} justifyContent={'space-between'}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                required
                fullWidth
                id="username"
                placeholder="your username"
                name="username"
                autoComplete="username"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register("username")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Log In
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}> or </Typography>
          </Divider>
          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/Signup" variant="body2" sx={{ alignSelf: 'center' }}>Sign up</Link>
          </Typography>
        </Card>
      </LoginContainer>
    </React.Fragment>
  );
}
