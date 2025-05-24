// /* File: components/StepperHeader.jsx */
// import React from 'react';
// import { Stepper, Step, StepLabel } from '@mui/material';

// const StepperHeader = ({ steps, activeStep }) => (
//   <Stepper 
//     activeStep={activeStep} 
//     alternativeLabel
//     sx={{
//       '& .MuiStepLabel-label': {
//         fontSize: '1.1rem',
//         fontWeight: 600
//       },
//       '& .MuiStepIcon-root': {
//         fontSize: '2rem'
//       }
//     }}
//   >
//     {steps.map((label) => (
//       <Step key={label}>
//         <StepLabel>{label}</StepLabel>
//       </Step>
//     ))}
//   </Stepper>
// );

// export default StepperHeader;


/* File: components/StepperHeader.jsx */
import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const StepperHeader = ({ steps, activeStep }) => (
  <Stepper 
    activeStep={activeStep} 
    alternativeLabel
    sx={{
      '& .MuiStepLabel-label': {
        fontSize: '1rem',
        fontWeight: 600
      },
      '& .MuiStepIcon-root': {
        fontSize: '1.75rem'
      }
    }}
  >
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default StepperHeader;