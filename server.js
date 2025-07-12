import express from 'express';
import cors from 'cors';
import { updateDailyGospel } from './scripts/updateDailyGospel.js';

const app = express();
const port = 3001; // Choose a port that doesn't conflict with Vite's default (5173)

app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from Vite development server
}));

app.get('/api/sync-gospel', async (req, res) => {
  console.log('Received request to sync gospel...');
  try {
    const success = await updateDailyGospel();
    if (success) {
      res.status(200).json({ message: 'Gospel synchronized successfully', success: true });
    } else {
      res.status(500).json({ message: 'Failed to synchronize gospel', success: false });
    }
  } catch (error) {
    console.error('Error during gospel sync API call:', error);
    res.status(500).json({ message: 'An unexpected error occurred', error: error.message, success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
