'use client';
import { fetchRecordByEmail } from '@/actions/sendEmail';
import { Result } from '@/types/app';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Typography,
  Alert,
  Link,
  Box,
} from '@mui/joy';
import { useState } from 'react';

export default function CheckEmailSatatus() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>();
  const [email, setEmail] = useState('');

  const handleEmailSubmission = async (sendEmail: boolean) => {
    try {
      setLoading(true);
      if (email.trim() === '') {
        return setResult({
          status: 'error',
          message: 'Please enter a valid email address or order ID.',
        });
      }

      const response = await fetchRecordByEmail(email, sendEmail);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult({ status: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap={2} width={{ xs: 1, md: 400 }}>
      <Typography level="title-md" textAlign="center">
        Check the status of your tickets and resend them to your email address.
      </Typography>
      {result && (
        <Alert color={result.status === 'success' ? 'success' : 'danger'}>{result.message}</Alert>
      )}
      <FormControl>
        <FormLabel>Email Address or Order ID</FormLabel>
        <Input
          placeholder="Enter email address or order ID"
          type="text"
          name="field"
          required
          size="lg"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          endDecorator={
            <Button type="submit" loading={loading} onClick={() => handleEmailSubmission(false)}>
              Check
            </Button>
          }
        />
      </FormControl>
      {result && result.status === 'success' && (
        <Button onClick={() => handleEmailSubmission(true)} loading={loading}>
          Resend Tickets
        </Button>
      )}
      {result && result.status === 'error' && (
        <Stack alignItems="center" gap={1}>
          <Typography level="body-xs" textAlign="center">
            If you still having no luck, please check your junk/spam or&nbsp;
          </Typography>
          <Button
            component="a"
            href="https://airtable.com/appZoMAdkFw8Jtnsg/pag0kHEBAE9hFiTlN/form"
          >
            click here
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
