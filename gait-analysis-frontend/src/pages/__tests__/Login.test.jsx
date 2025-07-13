import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import Login from '../Login';

// Create MUI theme for proper rendering
const theme = createTheme();

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock BASE_URL
vi.mock('../config', () => {
  return {
    default: 'http://localhost:3000'
  };
});

// Test wrapper component with proper providers
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockLocalStorage.setItem.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form elements correctly', () => {
      renderWithProviders(<Login />);

      // Check for form inputs using more specific selectors
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      
      // Check for placeholders
      expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the logo and title', () => {
      renderWithProviders(<Login />);

      expect(screen.getByText('RehabGait')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByAltText('RehabGait Logo')).toBeInTheDocument();
    });

    it('renders marketing content on desktop', () => {
      renderWithProviders(<Login />);

      expect(screen.getByText('Advanced Gait Analysis')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText(/empowering healthcare professionals/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      renderWithProviders(<Login />);

      const forgotPasswordLink = screen.getByRole('link', { name: /forgot your password/i });
      const contactLink = screen.getByRole('link', { name: /contact us to get started/i });
      
      expect(forgotPasswordLink).toHaveAttribute('href', '/contact');
      expect(contactLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('Form Validation', () => {
    it('does not show validation errors for valid input', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(usernameInput, 'validuser');
      await user.type(passwordInput, 'validpassword');

      // Check that no validation errors are shown
      expect(screen.queryByText('Username must be at least 3 characters')).not.toBeInTheDocument();
      expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login />);

      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click again to hide password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid credentials and navigates to admin dashboard', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          jwtToken: 'mock-jwt-token',
          roles: ['ROLE_ADMIN']
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/signin'),
          {
            username: 'admin',
            password: 'password'
          }
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('roles', JSON.stringify(['ROLE_ADMIN']));
        expect(mockNavigate).toHaveBeenCalledWith('/root/dashboard');
      });
    });

    it('navigates to clinic dashboard for clinic role', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          jwtToken: 'mock-jwt-token',
          roles: ['ROLE_CLINIC']
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'clinic');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/clinic/dashboard');
      });
    });

    it('navigates to doctor dashboard for doctor role', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          jwtToken: 'mock-jwt-token',
          roles: ['ROLE_DOCTOR']
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'doctor');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/doctor/dashboard');
      });
    });

    it('navigates to patient dashboard for patient role', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          jwtToken: 'mock-jwt-token',
          roles: ['ROLE_PATIENT']
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'patient');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/patient/dashboard');
      });
    });

    it('shows error message for unknown role', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          jwtToken: 'mock-jwt-token',
          roles: ['UNKNOWN_ROLE']
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/unknown role, access denied/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows error message when login fails with API error', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Invalid credentials';
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage
          }
        }
      });

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'baduser');
      await user.type(passwordInput, 'badpass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows default error message when no specific error is provided', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/login failed. please check your network or try again/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Snackbar Functionality', () => {
    it('shows and hides snackbar on error', async () => {
      const user = userEvent.setup();
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Test error'
          }
        }
      });

      renderWithProviders(<Login />);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password');
      await user.click(submitButton);

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText('Test error')).toBeInTheDocument();
      }, { timeout: 3000 });

      // The snackbar should auto-hide after 6 seconds, but we can also test the close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Wait for snackbar to disappear
      await waitFor(() => {
        expect(screen.queryByText('Test error')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithProviders(<Login />);

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      renderWithProviders(<Login />);

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle password visibility/i })).toBeInTheDocument();
    });

    it('has proper link roles', () => {
      renderWithProviders(<Login />);

      expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact us to get started/i })).toBeInTheDocument();
    });
  });
});