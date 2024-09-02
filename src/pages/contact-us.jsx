// components/Form.js
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useContactUsMutation } from "@/slices/contactUsApislice";
import { toast } from "react-toastify"; 

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    select: "",
    message: "",
  });

  const [contactUs] = useContactUsMutation(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: formData.name,
      email: formData.email,
      subject: formData.select, 
      message: formData.message,
    };

    try {
      
      await contactUs(dataToSend).unwrap(); 
      toast.success("Message sent successfully!"); 

      // Clear form data
      setFormData({
        name: "",
        email: "",
        select: "",
        message: "",
      });
    } catch (err) {
      // Show error toast with the error message
      toast.error(
        `Failed to send message: ${err.message || "Please try again."}`
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center">
      <Header />

      <div className="md:w-full md:max-w-[565px] h-full flex items-center justify-center my-5 md:my-11">
        <form
          className="w-full  lg:w-[800px] xl:w-[70%] mx-10 sm:mx-4 md:mx-10 lg:mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 xl:mb-[1vw] w-full">
            <label
              htmlFor="name"
              className="block mb-1 xl:mb-[1vw] w-full text-lg xl:text-[1vw]"
            >
              Name
            </label>
            <TextField
              fullWidth
              variant="outlined"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-100 min-h-[46px]"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  width: "100%",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                  width: "100%",
                  "@media (min-width:1440px)": {
                    fontSize: "1vw",
                    padding: ".5vw",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  width: "100%",
                },
              }}
            />
          </div>

          <div className="mb-4 xl:mb-[1vw] w-full">
            <label
              htmlFor="email"
              className="block mb-1 xl:mb-[1vw] w-full text-lg xl:text-[1vw]"
            >
              Email
            </label>
            <TextField
              fullWidth
              variant="outlined"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-100 min-h-[46px]"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  border: "none",
                  width: "100%",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                  width: "100%",
                  "@media (min-width:1440px)": {
                    fontSize: "1vw",
                    padding: ".5vw",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  width: "100%",
                },
              }}
            />
          </div>

          <div className="mb-4 xl:mb-[1vw] w-full">
            <FormControl fullWidth variant="outlined">
              <label
                htmlFor="select"
                className="block mb-1 xl:mb-[1vw] w-full text-lg xl:text-[1vw]"
              >
                Are you a Vendor or a User?
              </label>
              <Select
                id="select"
                name="select"
                value={formData.select}
                onChange={handleChange}
                className="bg-gray-100 min-h-[46px] xl:min-h-[5vh] text-lg xl:text-[1vw] flex items-center"
                sx={{
                  width: "100%",
                  outline: "none",
                  border: "none",
                  "& fieldset": {
                    border: "none !important",
                  },
                  "& .MuiOutlinedInput-root, & .MuiMenuItem-root": {
                    border: "none",
                    outline: "none",
                    "&:hover, &.Mui-focused": {
                      border: "none",
                      outline: "none",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px 14px",
                  },
                }}
              >
                <MenuItem
                  value="vendor"
                  className="text-lg xl:text-[1vw] xl:my-[1vw] text-center"
                >
                  Vendor
                </MenuItem>
                <MenuItem
                  value="user"
                  className="text-lg xl:text-[1vw] xl:my-[1vw] text-center"
                >
                  User
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mb-4 xl:mb-[1vw] w-full">
            <label
              htmlFor="message"
              className="block mb-1 xl:mb-[1vw] w-full text-lg xl:text-[1vw]"
            >
              Message
            </label>
            <TextareaAutosize
              id="message"
              placeholder="Message"
              name="message"
              value={formData.message}
              className="w-full px-3 py-2 border rounded-md resize-none bg-gray-100 min-h-[165px] xl:min-h-[15vh] text-lg xl:text-[1vw] xl:p-[1vw]"
              onChange={handleChange}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
              }}
            />
          </div>

          <Button
            type="submit"
            className="bg-[#000] w-full h-[56px] xl:h-[5vh] text-white text-lg xl:text-[1vw]"
            sx={{
              textTransform: "none",
              "&:hover": {
                background: "grey",
              },
            }}
          >
            Submit
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Form;
