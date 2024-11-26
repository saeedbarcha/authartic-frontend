import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  useFindEmailMutation,
  useSendOtpEmailMutation,
  useVerificationAccountMutation,
  useUpdatePasswordMutation,
} from "../slices/userApiSlice";

const RecoverPassword = () => {
  const [searchEmailRes, setSearchEmailRes] = useState("");
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleEmailSearch = async () => {
    try {
      if (email.length > 2) {
        const response = await findEmail({ email, role });
        if (response && response.statusCode === 404) {
          toast.error("No matching emails found.");
        } else if (response.error) {
          toast.error(
            response?.error?.data?.message ||
              response?.message ||
              "Enter valid email."
          );
        }
      } else {
        toast.error("Please enter a valid email address.");
      }
    } catch (error) {
      toast.error("Error occurred while searching your email");
    }
  };

  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleRadioChange = (suggestion) => {
    setSelectedEmail(suggestion);
    setEmail(suggestion); // Update the email input field with the selected suggestion
  };

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    try {
      const otpRequestData = {
        email: selectedEmail,
        role: role,
      };
      const response = await sendOtpEmail(otpRequestData).unwrap();
      toast.success(
        response?.message ||
          response?.data?.message ||
          "OTP code sent successfully"
      );
      setIsOtpSent(true);
      setCurrentPage(2); // Move to the OTP verification page
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error sending OTP code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const verifyData = {
        email: selectedEmail,
        role: role,
        otp: verifyCode,
      };
      const response = await verifyAccount(verifyData).unwrap();
      toast.success(response?.message || "OTP verified successfully");
      setIsOtpVerified(true);
      setCurrentPage(3); // Move to the password reset page
    } catch (error) {
      toast.error(error?.data?.message || "Error verifying OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars &&
      isValidLength
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    const updateData = {
      email: selectedEmail,
      password: newPassword,
      role: role,
    };

    setIsSubmitting(true);

    try {
      const response = await updatePassword(updateData).unwrap();
      toast.success(response.message || "Password updated successfully");
      router.push("/"); // Redirect after successful password update
    } catch (error) {
      toast.error(
        `Error updating password: ${
          error.message || "An unknown error occurred"
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
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${
            currentPage === 1 || isOtpSent
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
          className={`w-24 h-[2px] ${
            currentPage > 1 ? "bg-green-800" : "bg-gray-900"
          }`}
        ></span>
        <strong
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${
            currentPage === 2 && isOtpSent
              ? "text-green-800 border-2"
              : "text-blue-800"
          }`}
          onClick={() => setCurrentPage(2)}
          style={{ pointerEvents: isOtpSent ? "auto" : "none" }}
        >
          2
        </strong>
        <span
          className={`w-24 h-[2px] ${
            currentPage > 2 ? "bg-green-800" : "bg-gray-900"
          }`}
        ></span>
        <strong
          className={`font-kodchasan font-semibold text-lg flex items-center justify-center cursor-pointer rounded-full w-[30px] h-[30px] ${
            currentPage === 3 && isOtpVerified
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
              Enter your email address below and we will send you an OTP
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col items-center">
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  onClick={handleEmailSearch}
                  variant="contained"
                  color="primary"
                  className="mt-2"
                >
                  Search
                </Button>
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
                      <div key={index}>
                        <input
                          type="radio"
                          name="email"
                          value={suggestion}
                          onChange={() => handleRadioChange(suggestion)}
                        />
                        <label>{suggestion}</label>
                      </div>
                    ))}
                    {selectedEmail && (
                      <Button
                        onClick={handleSendOtp}
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        disabled={isOtpLoading}
                      >
                        {isOtpLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </form>
          </Box>
        </Box>
      )}

      {currentPage === 2 && isOtpSent && (
        <Box className="flex flex-col items-center justify-center p-4 h-full">
          <Box className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
            <Typography
              variant="h5"
              component="h1"
              className="text-center mb-4"
            >
              Enter OTP
            </Typography>
            <form onSubmit={handleVerifyOtp}>
              <TextField
                label="OTP Code"
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
                className="mt-4"
                disabled={isVerifyLoading}
              >
                {isVerifyLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>
            {isVerifyError && (
              <Typography color="error" className="mt-2">
                Error verifying OTP
              </Typography>
            )}
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
              <div className="relative">
                <TextField
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <IconButton
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>

              <div className="relative">
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <IconButton
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="mt-4 !bg-[#22477f]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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

export default RecoverPassword;
