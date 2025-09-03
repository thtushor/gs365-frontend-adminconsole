import React, { useState, useEffect } from "react";
import Select from "react-select";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useGetRequest } from "../Utils/apiClient";
import { API_LIST, BASE_URL } from "../api/ApiList";
import { useQuery } from "@tanstack/react-query";

const defaultForm = {
  username: "",
  password: "",
  confirmPassword: "",
  realName: "",
  phoneNumber: "",
  email: "",
  ageCheck: false,
  refCode: "",
  country: "",
  countryId: null,
  currency: null,
  callingCode: "+880",
};

const PlayerForm = ({ initialValues, onSubmit, loading, isEdit }) => {
  const getRequest = useGetRequest();
  const [form, setForm] = useState({
    ...defaultForm,
    ...initialValues,
    realName: initialValues?.fullname || "",
    phoneNumber: initialValues?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [phoneValue, setPhoneValue] = useState(initialValues?.phone || "");

  // Fetch country list
  const { data: countryData, isLoading: countryLoading } = useQuery({
    queryKey: ["country", { status: "active" }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_COUNTRIES,
        errorMessage: "Failed to fetch countries",
        isPublic: true,
        params: { status: "active" },
      }),
  });

  const countryOptions = React.useMemo(
    () =>
      countryData?.data?.length > 0
        ? countryData?.data?.map((country) => ({
            id: country?.id,
            value: country?.code,
            label: country?.name,
            currency: {
              id: country?.currency?.id,
              code: country?.currency?.code,
              name: country?.currency?.name,
            },
            phoneCode: `+${
              country.callingCode || (country.code === "BD" ? "880" : "")
            }`,
          }))
        : [],
    [countryData]
  );

  const currencyOptions =
    countryOptions.map((c) => ({
      value: c.currency?.id,
      label: `${c.currency?.name} (${c.currency?.code})`,
    })) || [];

  // Set default country/currency for create or edit
  useEffect(() => {
    if (countryOptions.length === 0) return;

    let selectedCountry;

    if (initialValues) {
      // Try to match country based on currencyCode
      selectedCountry =
        countryOptions.find(
          (c) => c.currency?.code === initialValues.currencyCode
        ) || countryOptions[0];
    } else {
      selectedCountry =
        countryOptions.find((c) => c.value === "BD") || countryOptions[0];
    }

    setForm((prev) => ({
      ...prev,
      country: selectedCountry.value,
      countryId: selectedCountry.id,
      currency: selectedCountry.currency?.id || null,
      callingCode: selectedCountry.phoneCode || "+880",
    }));

    if (initialValues?.phone) {
      setPhoneValue(initialValues.phone);
    }
  }, [initialValues, countryOptions]);

  // Sync phone input with form
  useEffect(() => {
    if (phoneValue) {
      const fullNumber = phoneValue.startsWith("+")
        ? phoneValue
        : `${form.callingCode}${phoneValue.replace(/^0+/, "")}`;
      setForm((prev) => ({ ...prev, phoneNumber: fullNumber }));
    }
  }, [phoneValue, form.callingCode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.length < 4 || form.username.length > 15)
      newErrors.username = "Username must be 4-15 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      newErrors.username =
        "Username can only contain letters, numbers, underscores";

    if (!isEdit) {
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 6 || form.password.length > 20)
        newErrors.password = "Password must be 6-20 characters";
      else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(form.password))
        newErrors.password = "Password must contain letters and numbers";

      if (!form.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      else if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.realName.trim()) newErrors.realName = "Full name is required";
    else if (form.realName.length < 2 || form.realName.length > 100)
      newErrors.realName = "Full name must be 2-100 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";

    if (!form.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!isValidPhoneNumber(form.phoneNumber))
      newErrors.phoneNumber = "Enter a valid phone number";

    if (!form.countryId) newErrors.country = "Country selection is required";
    if (!form.currency) newErrors.currency = "Currency selection is required";

    if (!form.ageCheck)
      newErrors.ageCheck = "You must be 18 or older and agree to the terms";

    if (form.refCode && form.refCode.length < 6)
      newErrors.refCode = "Referral code must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const apiData = {
        username: form.username.trim(),
        fullname: form.realName.trim(),
        phone: form.phoneNumber,
        email: form.email.trim(),
        password: form.password,
        country_id: form.countryId,
        currency_id: form.currency,
        refer_code: form.refCode?.trim() || undefined,
        isAgreeWithTerms: form.ageCheck,
      };

      await onSubmit(apiData);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Submission failed";
      setErrors({ general: errorMessage });
    }
  };

  const getFieldError = (fieldName) => errors[fieldName] || "";

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {errors.general && (
        <div className="text-red-500 text-sm">{errors.general}</div>
      )}

      <div>
        <label>Username *</label>
        <input
          name="username"
          value={form.username}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 w-full"
        />
        {getFieldError("username") && (
          <div className="text-red-500 text-xs">
            {getFieldError("username")}
          </div>
        )}
      </div>

      <div>
        <label>Full Name *</label>
        <input
          name="realName"
          value={form.realName}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 w-full"
        />
        {getFieldError("realName") && (
          <div className="text-red-500 text-xs">
            {getFieldError("realName")}
          </div>
        )}
      </div>

      {!isEdit && (
        <>
          <div>
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            {getFieldError("password") && (
              <div className="text-red-500 text-xs">
                {getFieldError("password")}
              </div>
            )}
          </div>

          <div>
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            />
            {getFieldError("confirmPassword") && (
              <div className="text-red-500 text-xs">
                {getFieldError("confirmPassword")}
              </div>
            )}
          </div>
        </>
      )}

      <div>
        <label>Country *</label>
        {countryLoading ? (
          <p>Loading countries...</p>
        ) : (
          <Select
            options={countryOptions}
            value={
              countryOptions.find((opt) => opt.value === form.country) || null
            }
            onChange={(selected) =>
              setForm((prev) => ({
                ...prev,
                country: selected.value,
                countryId: selected.id,
                currency: selected.currency?.id || null,
                callingCode: selected.phoneCode || "+880",
              }))
            }
            isSearchable
          />
        )}
        {getFieldError("country") && (
          <div className="text-red-500 text-xs">{getFieldError("country")}</div>
        )}
      </div>

      <div>
        <label>Currency *</label>
        <Select
          options={currencyOptions}
          value={
            currencyOptions.find((opt) => opt.value === form.currency) || null
          }
          onChange={(selected) =>
            setForm((prev) => ({
              ...prev,
              currency: selected ? selected.value : null,
            }))
          }
          isSearchable
        />
        {getFieldError("currency") && (
          <div className="text-red-500 text-xs">
            {getFieldError("currency")}
          </div>
        )}
      </div>

      <div>
        <label>Phone Number *</label>
        <div className="border rounded px-3 py-2 w-full">
          <PhoneInput
            international
            defaultCountry="BD"
            value={phoneValue}
            onChange={(value) => setPhoneValue(value || "")}
          />
          {getFieldError("phoneNumber") && (
            <div className="text-red-500 text-xs">
              {getFieldError("phoneNumber")}
            </div>
          )}
        </div>
      </div>

      <div>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 w-full"
        />
        {getFieldError("email") && (
          <div className="text-red-500 text-xs">{getFieldError("email")}</div>
        )}
      </div>

      <div>
        <label>Referral Code</label>
        <input
          name="refCode"
          value={form.refCode}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 w-full"
        />
        {getFieldError("refCode") && (
          <div className="text-red-500 text-xs">{getFieldError("refCode")}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ageCheck"
          checked={form.ageCheck}
          onChange={handleInputChange}
        />
        <label>I confirm I am 18+ and agree to terms *</label>
        {getFieldError("ageCheck") && (
          <div className="text-red-500 text-xs">
            {getFieldError("ageCheck")}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
        disabled={loading}
      >
        {loading
          ? isEdit
            ? "Updating..."
            : "Creating..."
          : isEdit
          ? "Update User"
          : "Create User"}
      </button>
    </form>
  );
};

export default PlayerForm;
