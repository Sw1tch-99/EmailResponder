import { useState } from 'react';
import './App.css';
import {
  Container,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate reply.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Email Reply Generator
        </Typography>

        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="sarcastic">Sarcastic</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="serious">Serious</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 3 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Generated Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={generatedReply}
              inputProps={{ readOnly: true }}
              sx={{ mb: 2, backgroundColor: '#fff' }}
            />
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App;
