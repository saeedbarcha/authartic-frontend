// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// Define base URL using the environment variable or fallback
export const BASE_URL = "http://localhost:5000/api/v1";
// export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

// Define other API endpoints
export const AUTH_URL = "/auth";
export const USER_URL = "/user";
export const CERTIFICATE_INFO_URL = "/certificate-info";
export const VALIDATION_CODE_URL = "/validation";
export const CREATE_VALIDATION_CODE_URL = "/admin/validation-code";
export const COUNTRY_URL = "/country";
export const ADMIN_COUNTRIES_URL = "/admin/country";
export const ADMIN_VENDORS_URL = "/admin/vendor";
export const UPLOAD_ATTACHMENT_URL = "/attachments";
export const SUBSCRIPTION_PLAN_URL = "/subscription-plan";
export const VENDOR_FONT_URL = "/font/active";
export const ADMIN_FONTS_URL = "/admin/font";
export const REPORT_PROBLEM_URL = "/report-problem";
export const ADMIN_REPORT_PROBLEM_URL = "/admin/report-problem";
export const CONTACT_US_URL = "/contact";
export const RE_ISSUE_EXISTING_URL = "/certificate-info/certificate";
