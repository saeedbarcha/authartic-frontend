import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,

} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SearchIcon from '@mui/icons-material/Search';
import {
  useFindEmailMutation,
  useSendOtpEmailMutation,
  useVerificationAccountMutation,
  useUpdatePasswordMutation,
} from "../slices/userApiSlice";
import WithAuth from "@/components/withAuth";

const RecoverPassword = () => {
  const [searchEmailRes, setSearchEmailRes] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VENDOR");
  const [findEmail, { data: suggestions = [], isLoading, isError, error }] =
    useFindEmailMutation();

  const [sendOtpEmail, { isLoading: isOtpLoading, isError: isOtpError }] =
    useSendOtpEmailMutation();
  const [
    verifyAccount,
    { isLoading: isVerifyLoading, isError: isVerifyError },
  ] = useVerificationAccountMutation();
  const [
    updatePassword,
    { isLoading: isUpdateLoading, isError: isUpdateError },
  ] = useUpdatePasswordMutation();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sending status
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification status
  const [verifyCode, setVerifyCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // Trigger search when email input changes
  const handleEmailSearch = async () => {
    try {
      if (email.length > 2) {
        const response = await findEmail({ email, role });
        if (response) {
          setSearchEmailRes(response?.error?.data?.message?.join(" "))
        } else {
          toast.error(error?.data?.message || error?.message || error?.data?.error || error?.error || 'Error occured while searching your email')
        }
      }

    } catch (error) {
      console.log('sadfasdfasdf')
      toast.error(error?.data?.message || error?.message || error?.data?.error || error?.error || 'Error occured while searching your email')
    }
  }

  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleRadioChange = (suggestion) => {
    setSelectedEmail(suggestion);
  };

  console.log(selectedEmail)

  
  // Handles checkbox selection

  // Handles OTP sending
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    try {
      const otpRequestData = {
        email: selectedEmail, // Send the first checked email
        role: role,
      };
      await sendOtpEmail(otpRequestData).unwrap();
      toast.success("OTP code sent successfully");
      setIsOtpSent(true);
      setCurrentPage(2); // Navigate to the next page
    } catch (error) {
      toast.error("Error sending OTP code");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const verifyData = {
        email: selectedEmail,
        role: role,
        otp: verifyCode,
      };
      await verifyAccount(verifyData).unwrap();
      toast.success("OTP verified successfully");
      setIsOtpVerified(true);
      setCurrentPage(3); // Navigate to the next page
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles password update
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Prepare the payload
    const updateData = {
      email: selectedEmail, // Ensure this field is correct per the API documentation
      password: newPassword, // Adjust field name based on API requirements
      role: role, // Include any other required fields
    };

    setIsSubmitting(true);

    try {
      // Call the updatePassword API mutation
      await updatePassword(updateData).unwrap();

      toast.success("Password updated successfully");

      // Redirect to home screen upon success
      router.push("/");
    } catch (error) {
      // Handle error
      toast.error(
        `Error updating password: ${error.message || "An unknown error occurred"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-green-50 h-screen flex flex-col p-4 overflow-scroll scroller-hidden">
      <Box className="flex justify-center items-center gap-3">
        <strong
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${currentPage === 1 || isOtpSent
            ? "text-green-800 border-2"
            : "text-blue-800"
            }`}
          onClick={() => setCurrentPage(1)}
          style={{
            pointerEvents: isOtpSent || currentPage === 1 ? "auto" : "none",
          }}
        >
          1
        </strong>
        <span
          className={`w-24 h-[2px] ${currentPage > 1 ? "bg-green-800" : "bg-gray-900"
            }`}
        ></span>
        <strong
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${currentPage === 2 && isOtpSent
            ? "text-green-800 border-2"
            : "text-blue-800"
            }`}
          onClick={() => setCurrentPage(2)}
          style={{ pointerEvents: isOtpSent ? "auto" : "none" }}
        >
          2
        </strong>
        <span
          className={`w-24 h-[2px] ${currentPage > 2 ? "bg-green-800" : "bg-gray-900"
            }`}
        ></span>
        <strong
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${currentPage === 3 && isOtpVerified
            ? "text-green-800 border-2"
            : "text-blue-800"
            }`}
          onClick={() => setCurrentPage(3)}
          style={{ pointerEvents: isOtpVerified ? "auto" : "none" }}
        >
          3
        </strong>
      </Box>

      {currentPage === 1 && (
        <Box className="flex flex-col items-center justify-center p-4 h-full">
          <Box className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
            <Typography
              variant="h5"
              component="h1"
              className="text-center mb-4"
            >
              Enter your email address
            </Typography>
            <Typography variant="body1" className="text-center text-xs mb-4">
              Enter your email address below and we will   send you an OTP
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
            >
              <div className="flex flex-col items-end">
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div onClick={() => handleEmailSearch()} className="bg-[#22477f] flex text-white cursor-pointer items-center justify-center rounded-lg px-2 py-[px]">
                  <p>Search</p>
                </div>
              </div>
              <div className="w-full mt-4">
                {isLoading && <CircularProgress />}
                {isError && (
                  <Typography color="error">{searchEmailRes}</Typography>
                )}
                {suggestions.length > 0 && (
                  <div>
                    <Typography variant="subtitle1">
                      Suggested emails:
                    </Typography>
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center gap-3 my-1">
                          <input
                            type="radio"
                            name="email"
                            id={index}
                            checked={selectedEmail === suggestion}
                            onChange={() => handleRadioChange(suggestion)}
                          />
                          <label htmlFor={index}>
                            {suggestion}
                          </label>
                        </div>
                      ))}
                  </div>
                )}
              </div>


              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4 !bg-[#22477f]"
                disabled={isLoading || isSubmitting || isOtpLoading}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Send OTP code"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      )}

      {currentPage === 2 && (
        <Box className="flex flex-col items-center justify-center h-full">
          <Box className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg text-center">
            <Typography
              variant="h5"
              component="h1"
              className="text-center mb-4"
            >
              Enter your OTP
            </Typography>
            <span className="text-xs">We have send an OTP on <b>{selectedEmail}</b></span>
            <form onSubmit={handleVerifyOtp}>
              <TextField
                label="OTP Code"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4 !bg-[#22477f]"
                disabled={isVerifyLoading || isSubmitting}
              >
                {isVerifyLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      )}

      {currentPage === 3 && (
        <Box className="flex flex-col items-center justify-center h-full">
          <Box className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
            <Typography
              variant="h5"
              component="h1"
              className="text-center mb-4"
            >
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
                className="mt-4 !bg-[#22477f]"
                disabled={isSubmitting || isUpdateLoading}
              >
                {isSubmitting || isUpdateLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default RecoverPassword
