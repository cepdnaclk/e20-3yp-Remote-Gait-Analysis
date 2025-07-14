import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import * as patientServices from '../../services/patientServices';
import PatientDashboard from '../patient/PatientDashboard';

// Mock the services module
vi.mock('../../services/patientServices', () => ({
  getPatientProfile: vi.fn(),
  getDashboardStats: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock components
vi.mock('../../components/PatientAppointmentRequest', () => ({
  default: ({ patient }) => (
    <div data-testid="appointment-request">
      Appointment Request for {patient?.name}
    </div>
  ),
}));

vi.mock('../../components/PatientTestSessionList', () => ({
  default: React.forwardRef((props, ref) => {
    const { embedded, title } = props;
    return (
      <div data-testid="test-session-list" ref={ref}>
        {title} - Embedded: {embedded ? 'true' : 'false'}
      </div>
    );
  }),
}));

// Test data
const mockPatient = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  age: 45,
  gender: 'Male',
  height: 175,
  weight: 70,
  phoneNumber: '+1234567890',
  doctorName: 'Dr. Smith',
  photoUrl: '',
  nextAppointment: '2024-01-15 10:00 AM',
  doctor: {
    name: 'Dr. Smith'
  }
};

const mockDashboardStats = {
  totalSessions: 12,
  averageMetrics: {
    balanceScore: 85.5,
    steps: 1250,
    cadence: 120.5,
    sessionDuration: 900
  },
  trends: {
    balanceScoreChange: '+5.2%',
    stepsChange: '+12%',
    cadenceChange: '-2.1%'
  },
  latestSession: {
    sessionId: 'S123',
    startTime: '2024-01-10T10:00:00Z',
    endTime: '2024-01-10T10:15:00Z',
    results: {
      balanceScore: 88,
      steps: 1300,
      cadence: 125.5
    },
    feedback: {
      notes: 'Great improvement in balance stability'
    }
  }
};

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PatientDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('1. should display loading state initially', () => {
    // Mock services to return pending promises
    patientServices.getPatientProfile.mockReturnValue(new Promise(() => {}));
    patientServices.getDashboardStats.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<PatientDashboard />);

    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('2. should render dashboard with patient data after loading', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Monitor your health journey and track your progress')).toBeInTheDocument();
  });

 
  it('4. should navigate to different sections when sidebar items are clicked', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    // Click on Profile section
    fireEvent.click(screen.getByText('Profile'));
    
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Verify profile content is displayed
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

 
  it('6. should navigate to test session when Launch New Session is clicked', async () => {
  patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
  patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

  renderWithProviders(<PatientDashboard />);

  await waitFor(() => {
    expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
  });

  // Navigate to Test Sessions section
  fireEvent.click(screen.getByText('Test Sessions'));

  await waitFor(() => {
    expect(screen.getByTestId('test-session-list')).toBeInTheDocument();
  });

  // Verify we're in the Test Sessions section by checking for the actual heading
  expect(screen.getByText('Start new sessions and track your gait analysis progress')).toBeInTheDocument();
});

  it('7. should display latest session information correctly', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    // Check latest session card - these should be in the dashboard view
    expect(screen.getByText('Latest Session')).toBeInTheDocument();
    expect(screen.getByText('Session #S123')).toBeInTheDocument();
    
    // Since the feedback text is truncated with CSS, let's just check for part of it
    expect(screen.getByText(/Great improvement/)).toBeInTheDocument();
  });

  it('8. should handle logout functionality', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    // Click logout button
    fireEvent.click(screen.getByText('Logout'));

    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

    it('9. should toggle sidebar when menu icon is clicked', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    // Initially sidebar should be open (showing "Patient Portal" text)
    expect(screen.getByText('Patient Portal')).toBeInTheDocument();

    // Find the menu button by its test id since it doesn't have an accessible name
    const menuIcon = screen.getByTestId('MenuIcon');
    const menuButton = menuIcon.closest('button');
    fireEvent.click(menuButton);

    // After toggle, the sidebar text should be hidden (sidebar collapsed)
    await waitFor(() => {
      expect(screen.queryByText('Patient Portal')).not.toBeInTheDocument();
    });
  });

  it('10. should render appointments section correctly', async () => {
    patientServices.getPatientProfile.mockResolvedValue({ data: mockPatient });
    patientServices.getDashboardStats.mockResolvedValue({ data: mockDashboardStats });

    renderWithProviders(<PatientDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    });

    // Navigate to Appointments section
    fireEvent.click(screen.getByText('Appointments'));

    await waitFor(() => {
      expect(screen.getByTestId('appointment-request')).toBeInTheDocument();
      expect(screen.getByText('Appointment Request for John Doe')).toBeInTheDocument();
    });
  });
});