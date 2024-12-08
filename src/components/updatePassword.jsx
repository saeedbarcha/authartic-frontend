import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
    
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Password updated successfully!');
      router.push('/login'); // Redirect to login page after successful password update
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Box className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
        <Typography variant="h5" component="h1" className="text-center mb-4">
          Update Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UpdatePassword;
