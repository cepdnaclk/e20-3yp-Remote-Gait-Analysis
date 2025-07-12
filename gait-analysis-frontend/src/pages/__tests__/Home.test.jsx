import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Home Page', () => {
  beforeEach(() => {
    renderWithRouter(<Home />);
  });

  test('renders main heading and subtext', () => {
    expect(screen.getByRole('heading', { name: /remote gait analysis/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering healthcare professionals/i)).toBeInTheDocument();
  });

  test('renders Get Started button linking to /login', () => {
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/login');
  });

  test('renders Learn More button linking to /about', () => {
    const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreButton).toBeInTheDocument();
    expect(learnMoreButton).toHaveAttribute('href', '/about');
  });

  test('renders user type section title', () => {
    expect(screen.getByRole('heading', { name: /built for healthcare professionals/i })).toBeInTheDocument();
  });

  test('renders features section title', () => {
    expect(screen.getByRole('heading', { name: /why choose rehabgait/i })).toBeInTheDocument();
  });
});
