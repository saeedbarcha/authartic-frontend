import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  Box,
  MenuItem,
  Checkbox,
  Typography,
} from "@mui/material";
import Icon from "../assets/images/elements.svg";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useRouter } from "next/router";
import { useGetActiveCountriesQuery } from "@/slices/countriesApiSlice";
import { useUploadAttachmentMutation } from "@/slices/uploadAttachmentApiSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "@/slices/userApiSlice";

const CodeRegistration = () => {
  const [uploadResult, setUploadResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCode, setSelectedCode] = useState("");

  const [brandName, setBrandName] = useState("");
  const [primaryContent, setPrimaryContent] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [otherLinks, setOtherLinks] = useState([]);
  const [validation_code_id, setValidationCodeId] = useState(0);
  const [acceptForm, setAcceptForm] = useState(false);

  const router = useRouter();
  const [uploadAttachment] = useUploadAttachmentMutation();
  const [register, { isLoading }] = useRegisterMutation();
  const uploadProductImageRef = useRef(null);
  const [imageFiles, setImageFiles] = useState({
    productImage: null,
  });
  const [productImagePreview, setProductImagePreview] = useState({
    productImagePreview: null,
    customImagePreview: null,
  });

  const handleProductImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      toast.success(selectedFile.name);
      setImageFiles((prev) => ({
        ...prev,
        productImage: selectedFile,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview((prev) => ({
          ...prev,
          productImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleProductImageInputClick = () =>
    uploadProductImageRef.current.click();

  const {
    data: countries = [],
    error: countryError,
    isLoading: isCountryLoading,
  } = useGetActiveCountriesQuery();

  useEffect(() => {
    setValidationCodeId(localStorage.getItem("validCodeId"));
  }, []);

  const handleBrandNameChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCode(e.target.value);
  };

  const handlesocialMediaLinksChange = (index, value) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index] = value;
    setSocialMediaLinks(updatedLinks);
  };

  const handleOtherLinkChange = (index, value) => {
    const updatedLinks = [...otherLinks];
    updatedLinks[index] = value;
    setOtherLinks(updatedLinks);
  };

  // testing
  const isValidPassword = (password) => {
    const minLength = 8; // Example minimum length
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Define validation rules
    const validationRules = [
      { condition: !brandName, message: "Brand name is required" },
      {
        condition: !imageFiles.productImage,
        message: "Brand logo is required",
      },
      { condition: !primaryContent, message: "Primary content is required" },
      { condition: !email, message: "E-mail is required" },
      { condition: !selectedCountry.id, message: "Country is required" },
      { condition: !selectedCode, message: "Country code is required" },
      { condition: !phone, message: "Phone is required" },
      { condition: !password, message: "Password is required" },
      { condition: !confirmPassword, message: "Confirm password is required" },
      {
        condition: password !== confirmPassword,
        message: "Passwords do not match",
      },
      { condition: !description, message: "Description is required" },

      {
        condition: !isValidPassword(password),
        message:
          "Password must be at least 8 characters long and include upper/lowercase letters, numbers, and special characters.",
      },
    ];

    // Check validation rules
    for (const rule of validationRules) {
      if (rule.condition) {
        toast.error(rule.message);
        return;
      }
    }

    if (acceptForm) {
      if (imageFiles.productImage) {
        try {
          const formData = new FormData();
          formData.append("file", imageFiles.productImage);
          formData.append("type", "text/photo");

          // Upload image
          const uploadRes = await uploadAttachment(formData).unwrap();
          setUploadResult(uploadRes);

          // Prepare registration data
          const registerData = {
            user_name: brandName,
            primary_content: primaryContent,
            email: email,
            phone: `${selectedCode}-${phone}`,
            password: password,
            about_brand: description,
            website_url: website,
            social_media: socialMediaLinks?.filter((f) => f !== ""),
            other_links: otherLinks?.filter((f) => f !== ""),
            country_id: selectedCountry.id,
            validation_code_id: validation_code_id,
            attachment_id: uploadRes.data.id,
            role: "VENDOR",
          };

          // Send registration request
          const response = await register(registerData).unwrap();

          // Redirect on success
          router.push("/");
        } catch (error) {
          toast.error(
            error?.data?.message ||
              error?.data?.message[0] + " " + error?.data?.message[1]
          );
        }
      } else {
        toast.warning("Product image not selected");
      }
    } else {
      toast.warning("Accept terms and services to continue");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Header />
      <Box className="min-h-screen p-4">
        <Box className="max-w-[1091px] w-full mx-auto">
          <Box className="flex justify-center items-center flex-wrap gap-5 mb-6">
            <TextField
              label="Brand Name"
              variant="outlined"
              value={brandName}
              onChange={handleBrandNameChange}
              error={Boolean(errors.brandName)}
              helperText={errors.brandName}
              sx={textFieldStyles}
            />
            <Box className="flex items-center flex-wrap gap-4 justify-center">
              <Button className="flex text-black bg-[#fff] rounded-[41.47px] px-4 py-2 gap-2">
                {productImagePreview.productImagePreview ? (
                  <Avatar
                    alt="Product Image"
                    src={productImagePreview.productImagePreview}
                    sx={{ width: 46, height: 46 }}
                  />
                ) : (
                  <Image src={Icon} alt="Icon" width={40} height={40} />
                )}
                <Typography className="font-DMSans">Brand Logo</Typography>
                <input
                  type="file"
                  className="hidden"
                  ref={uploadProductImageRef}
                  onChange={handleProductImageChange}
                />
              </Button>
              <Button
                className="bg-[#3276E8] text-white rounded-[41.47px] w-full sm:w-auto px-4 py-2 mt-3 hover:bg-[#3276E8]"
                onClick={handleProductImageInputClick}
              >
                Upload Now
              </Button>
            </Box>
          </Box>

          <Box className="flex justify-center mb-6">
            <div className="w-[50%] h-[1px] bg-black"></div>
          </Box>

          <Box className="sm:none md:flex flex-col sm:flex-col md:flex-row sm:flex-wrap md:flex-wrap lg:flex-nowrap sm:gap-2 md:gap-2 lg:gap-20">
            <Box className="w-full lg:min-w-[400px]">
              <TextField
                label="Name of Primary Content"
                variant="outlined"
                fullWidth
                name="primaryContent"
                value={primaryContent}
                onChange={(e) => setPrimaryContent(e.target.value)}
                sx={textFieldStyles}
                className="mb-10"
              />
              <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={textFieldStyles}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                  textAlign: "center",
                }}
              >
                This email will be used for login and <br /> certificates will
                be sent to this email
              </Typography>

              <TextField
                select
                label="Country"
                variant="outlined"
                fullWidth
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                sx={textFieldStyles}
                className="my-12"
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box className="flex items-center">
                <TextField
                  select
                  sx={textFieldCodeStyles }
                  variant="outlined"
                  label="code"
                  name="countryCode"
                  value={selectedCode}
                  onChange={handleCountryCodeChange}
                >
                  {countries.map((countrycode) => (
                    <MenuItem key={countrycode.id} value={countrycode.code}>
                      {countrycode.code}: {countrycode.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Phone"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={textFieldPhoneeStyles}
                />
              </Box>

              <Typography
                variant="body2"
                color="textSecondary"
                className="text-[20px] my-5"
              >
                We will never call you
              </Typography>

              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={textFieldStyles}
                className="my-9"
              />

              <TextField
                label="Confirm password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={textFieldStyles}
                className="mb-9"
              />
            </Box>

            <Box className="lg:min-w-[400px] w-full">
              <TextField
                label="Tell Us About Your Brand"
                multiline
                rows={7}
                variant="outlined"
                fullWidth
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={textFieldStyles}
                className="mb-12"
              />
              <TextField
                label="Website"
                variant="outlined"
                fullWidth
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Social Media Link 1"
                variant="outlined"
                fullWidth
                value={socialMediaLinks[0]}
                onChange={(e) =>
                  handlesocialMediaLinksChange(0, e.target.value)
                }
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Social Media Link 2"
                variant="outlined"
                fullWidth
                value={socialMediaLinks[1]}
                onChange={(e) =>
                  handlesocialMediaLinksChange(1, e.target.value)
                }
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Social Media Link 3"
                variant="outlined"
                fullWidth
                value={socialMediaLinks[2]}
                onChange={(e) =>
                  handlesocialMediaLinksChange(2, e.target.value)
                }
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Other Link 1"
                variant="outlined"
                fullWidth
                value={otherLinks[0]}
                onChange={(e) => handleOtherLinkChange(0, e.target.value)}
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Other Link 2"
                variant="outlined"
                fullWidth
                value={otherLinks[1]}
                onChange={(e) => handleOtherLinkChange(1, e.target.value)}
                sx={textFieldStyles}
                className="mb-2"
              />
              <TextField
                label="Other Link 3"
                variant="outlined"
                fullWidth
                value={otherLinks[2]}
                onChange={(e) => handleOtherLinkChange(2, e.target.value)}
                sx={textFieldStyles}
                className="mb-2"
              />
            </Box>
          </Box>

          <Box className="md:flex sm:flex-row md:justify-center md:items-center my-12">
            <Checkbox
              checked={acceptForm}
              onChange={(e) => setAcceptForm(e.target.checked)}
              sx={{
                color: "green",
                "&.Mui-checked": {
                  color: "green",
                },
              }}
            />
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              I have the authority to make this account on behalf of the brand
              and I agree to the{" "}
              <span className="font-bold">terms and services</span>
            </Typography>

            <Button
              disabled={!acceptForm}
              variant="contained"
              className="bg-[#22477F] rounded-[7px] font-kodchasan"
              sx={{
                fontFamily: "Kodchasan, sans-serif",
              }}
              onClick={submitHandler}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default CodeRegistration;

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#606060",
      borderWidth: "2px",
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#606060",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#606060",
    },
  },
};

const textFieldCodeStyles = {
  width: "120px",
  Border: "0px",

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#606060",
      borderWidth: "2px",
      borderRadius: "10px 0px 0px 10px",
    },
    "&:hover fieldset": {
      borderColor: "#606060",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#606060",
    },
  },
};

const textFieldPhoneeStyles = {
  BorderLeft: "0px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#606060",
      borderWidth: "2px",
      borderRadius: "0px 10px 10px 0px",
    },
    "&:hover fieldset": {
      borderColor: "#606060",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#606060",
    },
  },
};
