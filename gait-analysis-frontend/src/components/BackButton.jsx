import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1); // fallback to browser back
    }
  };

  return (
    <Tooltip title="Go Back">
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: '#1976D2',
          zIndex: 1000,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
