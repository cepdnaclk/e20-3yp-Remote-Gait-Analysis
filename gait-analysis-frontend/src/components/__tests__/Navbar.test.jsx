import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// test login
test('renders Login button that links to /login', () => {
  renderWithRouter(<Navbar />);

  // This will now correctly find the <a> element with text "Login"
  const loginLink = screen.getByRole('link', { name: /login/i });

  // Expect it to be present
  expect(loginLink).toBeInTheDocument();

  // And expect it to have the right href
  expect(loginLink).toHaveAttribute('href', '/login');
});

// test about us
test('renders About Us link that navigates to /about', () => {
  renderWithRouter(<Navbar />);

  const aboutLink = screen.getByRole('link', { name: /about us/i });

  expect(aboutLink).toBeInTheDocument();
  expect(aboutLink).toHaveAttribute('href', '/about');
});

