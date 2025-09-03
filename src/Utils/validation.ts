import { isValidPhoneNumber } from "react-phone-number-input";

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Registration form validation
export const validateRegistrationForm = (data: {
  username: string;
  password: string;
  confirmPassword: string;
  currencyType: string;
  friendReferCode?: string;
  realName: string;
  callingCode: string;
  phoneNumber: string;
  email: string;
  ageCheck: boolean;
}): ValidationResult => {
  const errors: ValidationError[] = [];
  console.log(data.phoneNumber);

  // Username validation
  if (!data.username.trim()) {
    errors.push({ field: "username", message: "Username is required" });
  } else if (data.username.length < 4 || data.username.length > 15) {
    errors.push({
      field: "username",
      message: "Username must be between 4-15 characters",
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push({
      field: "username",
      message: "Username can only contain letters, numbers, and underscores",
    });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (data.password.length < 6 || data.password.length > 20) {
    errors.push({
      field: "password",
      message: "Password must be between 6-20 characters",
    });
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(data.password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one letter and one number",
    });
  }

  // Confirm password validation
  if (!data.confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Confirm password is required",
    });
  } else if (data.password !== data.confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match",
    });
  }

  // Currency validation
  if (!data.currencyType) {
    errors.push({
      field: "currencyType",
      message: "Currency selection is required",
    });
  }

  // Real name validation
  if (!data.realName.trim()) {
    errors.push({ field: "realName", message: "Full name is required" });
  } else if (data.realName.length < 2 || data.realName.length > 100) {
    errors.push({
      field: "realName",
      message: "Full name must be between 2-100 characters",
    });
  }

  // Phone number validation
  if (!data.phoneNumber.trim()) {
    errors.push({ field: "phoneNumber", message: "Phone number is required" });
  } else if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.push({
      field: "phoneNumber",
      message: "Enter a valid phone number",
    });
  }

  // Email validation
  if (!data.email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Enter a valid email address" });
  }

  // Age check validation
  if (!data.ageCheck) {
    errors.push({
      field: "ageCheck",
      message: "You must be 18 or older and agree to the terms",
    });
  }

  // Referral code validation (optional)
  if (data.friendReferCode && data.friendReferCode.length < 6) {
    errors.push({
      field: "friendReferCode",
      message: "Referral code must be at least 6 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Transform form data to API format
export const transformRegistrationData = (formData: {
  username: string;
  password: string;
  confirmPassword: string;
  currencyType: string;
  friendReferCode?: string;
  realName: string;
  callingCode: string;
  phoneNumber: string;
  email: string;
  ageCheck: boolean;
}) => {
  // Combine calling code and phone number
  const fullPhone = `${formData.phoneNumber}`;

  // Map currency type to currency_id
  const currencyIdMap: Record<string, number> = {
    "8": 1, // BDT
    "7": 2, // INR
    "24": 3, // NPR
    "17": 4, // PKR
  };

  return {
    username: formData.username.trim().toLowerCase(),
    fullname: formData.realName.trim(),
    phone: fullPhone,
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    currency_id: currencyIdMap[formData.currencyType] || 1,
    refer_code: formData.friendReferCode?.trim() || undefined,
    isAgreeWithTerms: formData.ageCheck,
  };
};

// Transform form data to API format
export const transformAffiliateRegistrationData = (formData: {
  username: string;
  password: string;
  confirmPassword: string;
  currencyType: string;
  friendReferCode?: string;
  realName: string;
  callingCode: string;
  phoneNumber: string;
  email: string;
  ageCheck: boolean;
}) => {
  // Map currency type to currency_id
  // const currencyIdMap: Record<string, number> = {
  //   "8": 1, // BDT
  //   "7": 2, // INR
  //   "24": 3, // NPR
  //   "17": 4, // PKR
  // };

  return {
    username: formData.username.trim().toLowerCase(),
    fullname: formData.realName.trim(),
    phone: formData.phoneNumber,
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    // currency: currencyIdMap[formData.currencyType] || 1,
    currency: 1,
    refCode: formData.friendReferCode?.trim() || undefined,
    status: "inactive",
    role: "superAffiliate",
  };
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 11 && cleaned.startsWith("01")) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  return cleaned;
};

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const getPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Minimum length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("At least 8 characters are required");
  }

  // Lowercase letter check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one lowercase letter is required");
  }

  // Uppercase letter check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one uppercase letter is required");
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one number is required");
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push("At least one special character is required");
  }

  return { score, feedback };
};
