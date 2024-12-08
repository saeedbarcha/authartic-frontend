import React, { useState } from "react";
import { Modal, Typography, Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const VerificationModal = ({
  open,
  handleClose,
  handleVerificationSuccess,
  verifyVendorFunc,
  vendorId,
  fetchVendorsAgain,
  fetchCodesAgain 
}) => {
  const [validationCode, setValidationCode] = useState("");

  const submitHandler = async () => {
    try {
      let res = await verifyVendorFunc({
        vendor_id: vendorId,
        validation_code: validationCode
      });
      if (res?.error) {
        if (res.error.status === 404) {
          toast.error(res?.error?.data?.message);
        } else {
          toast.error("An error occurred: " + (res.error.message || "Unknown error"));
        }
      } else {
        handleVerificationSuccess(res?.data?.validation_code?.code);
        toast.success(res?.data?.vendor_name + " Verified Successfully");
        fetchVendorsAgain();
        fetchCodesAgain(); 
        handleClose();
      }
    } catch (err) {


      if (err?.response?.data) {
        toast.error(err.response.data.message || "An unknown error occurred");
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-lg w-full">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Verify Vendor
            </Typography>
            <Typography id="modal-modal-description" className="mt-2">
              Please enter the validation code to verify the vendor.
            </Typography>
            <TextField
              label="Validation Code"
              variant="outlined"
              fullWidth
              className="mt-4"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
            />
            <Button
              onClick={submitHandler}
              variant="contained"
              color="primary"
              className="mt-4"
            >
              Verify
            </Button>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};


export default VerificationModal;
