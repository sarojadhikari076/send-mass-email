'use client';
import { fetchRecordByEmail } from '@/actions/sendEmail';
import { Result } from '@/types/app';
import { FormControl, FormLabel, Input, Button, Stack, Typography, Alert, Link } from '@mui/joy';
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
      {result && (
        <Alert color={result.status === 'success' ? 'success' : 'danger'}>{result.message}</Alert>
      )}
      <FormControl sx={{ mb: 10 }}>
        <FormLabel>Check ticket status</FormLabel>
        <Input
          placeholder="Enter Email Address or Order ID"
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
        <Stack gap={1}>
          <Typography level="body-sm">
            If you have not received the email, you can resend the tickets to the email address.
          </Typography>
          <Button onClick={() => handleEmailSubmission(true)} loading={loading}>
            Resend Tickets
          </Button>
          <Typography level="body-xs" textAlign="center">
            If you still having no luck, please check your junk/spam or email us at&nbsp;
            <Link href="mailto:tickets@vegancampouttickets.com">
              tickets@vegancampouttickets.com
            </Link>
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
