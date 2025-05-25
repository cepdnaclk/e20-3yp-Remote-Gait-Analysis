// File: utils/sendCommand.js
import axiosInstance from '../services/axiosInstance';

const sendCommand = async (command) => {
  try {
    const payload = {
      command,
      timestamp: new Date().toISOString()
    };

    await axiosInstance.post('/api/commands', payload);
    console.log(`✅ Command '${command}' sent to backend`);
  } catch (error) {
    console.error(`❌ Failed to send command '${command}':`, error?.response?.data || error.message);
  }
};

export default sendCommand;
