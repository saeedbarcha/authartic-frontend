import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import RegisterBTN from "@/components/muiButton";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/slices/userApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const LoginForm = ({ title, from }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (userInfo.role === "VENDOR") {
        const hasPlan = userInfo.plan === "pro";
        if (hasPlan) {
          router.push("/issue-certificate");
        } else {
          router.push("/package-plans");
        }
      }
    }
  }, [userInfo, router]);

  const submitHandler = async (selectedRole) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (!selectedRole) {
      toast.error("Role is required");
      return;
    }
    try {
      const res = await login({ email, password, role: selectedRole }).unwrap();

      if (res.user) {
        if (res.user.role !== selectedRole) {
          toast.error("Access denied. Invalid role.");
          return;
        }
        toast.success(
          res?.message || res?.data?.message || "Login successful!"
        );
        dispatch(setCredentials({ ...res }));

        if (res.user.role === "ADMIN") {
          router.push("/admin-dashboard");
        } else if (res.user.role === "VENDOR") {
          const hasPlan = res.user.subscriptionStatus;
          if (hasPlan) {
            router.push("/home-after-login");
          } else {
            router.push("/package-plans");
          }
        }

        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const errorMessage =
        err?.data?.message || err.error || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: 1,
        },
      }}
      noValidate
      autoComplete="off"
      className="w-full sm:w-3/4 md:max-w-[336px] lg:max-w-[336px] flex flex-col gap-2 p-4 sm:p-0"
    >
      <h1
        className={`text-center text-[20px] xl:text-[1vw] text-[#080808] font-light Koho-light`}
      >
        {title}
      </h1>
      {/* Email TextField */}
      <TextField
        id="outlined-email"
        label="Email"
        fullWidth
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          width: "-webkit-fill-available",
          borderRadius: "10px",
          "& .MuiInputLabel-root": {
            color: "#606060",
            fontWeight: "semi-bold",
            mx: "3px",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": {
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
        }}
        className="mb-10"
      />
      {/* Password TextField */}
      <TextField
        id="outlined-password"
        label="Password"
        fullWidth
        name="password"
        type={showPassword ? "text" : "password"} // Toggle password visibility
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          width: "-webkit-fill-available",
          borderRadius: "10px",
          "& .MuiInputLabel-root": {
            color: "#606060",
            fontWeight: "semi-bold",
            mx: "3px",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": {
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
        }}
        className="mb-10"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className="flex items-center justify-between md:justify-center px-3 md:p-0">
        <div className="flex items-center justify-start overflow-hidden bg-[#22477F] p-[1px]  rounded-[7px]">
          <Button
            className="cursor-pointer font-kodchasan text-md md:text-lg xl:text-xl text-white hover:bg-[#22477F] font-normal py-1 px-5 md:px-9 bg-[#22477F]"
            onClick={() => submitHandler(from === "ADMIN" ? "ADMIN" : "VENDOR")}
          >
            Login
          </Button>
        </div>
        <div className="block md:hidden">
          <RegisterBTN title={"Register"} />
        </div>
      </div>
      <div className="flex flex-col items-center sm:items-end justify-start my-3 sm:mx-2">
        <Link
          href={"/recover-password"}
          className={`text-black font-bold text-[15px] font-kodchasan`}
        >
          Recover Lost Account
        </Link>
      </div>
    </Box>
  );
};

export default LoginForm;
