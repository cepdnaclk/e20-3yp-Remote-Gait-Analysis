import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Stack, CssBaseline, Divider, FormLabel, FormControl, Link } from "@mui/material";
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form Validation Schema
const schema = z.object({
  email: z.string().email("Invalid email format"),
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
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <LoginContainer direction={'column'} justifyContent={'space-between'}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
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
