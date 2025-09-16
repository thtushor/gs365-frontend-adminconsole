import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useCurrencies } from "./useCurrencies";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { API_LIST, BASE_URL } from "../../api/ApiList";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useGetRequest } from "../../Utils/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useDesignations } from "../../hooks/useDesignations";
import {
  staticAdminCheck,
  staticAffiliatePermission,
} from "../../Utils/staticAffiliatePermission";

// simple debounce hook
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const defaultForm = {
  username: "",
  fullname: "",
  phone: "",
  email: "",
  password: "",
  role: "",
  city: "",
  street: "",
  minTrx: "",
  maxTrx: "",
  currency: null,
  designation: "",
  commission_percent: null,
  status: "active",
  refer_code: "",
};

export function CreateAgentForm({
  onSubmit,
  initialValues,
  isLoading,
  isEdit,
  isRefVisible = false,
  roles,
  isAffiliate = false,
  isOwner = false,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refCodeFromUrl =
    user?.role === "superAffiliate"
      ? user?.refCode
      : queryParams.get("refCode") || "";
  const { data: currencyList, isLoading: currencyLoading } = useCurrencies();

  const currencyOptions =
    currencyList?.map((currency) => ({
      value: currency.id,
      label: `${currency.name} (${currency.code})`,
    })) || [];

  const [form, setForm] = useState(initialValues || defaultForm);
  const [showPassword, setShowPassword] = useState(false);

  // state for referral details
  const [refDetails, setRefDetails] = useState(null);

  // debounce refer_code
  const debouncedRefCode = useDebounce(form.refer_code, 600);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const {
    data: affiliateDetails,
    isLoading: affiliateDetailsLoading,
    isError,
  } = useQuery({
    queryKey: ["affiliateProfile", initialValues?.referred_by],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.AFFILIATE_PROFILE,
        params: { id: initialValues?.referred_by || "-1" },
        errorMessage: "Failed to fetch affiliate profile",
      }),
    keepPreviousData: true,
    enabled: !!initialValues?.referred_by,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.role &&
      filteredDesignations.length > 0 &&
      !form.designation &&
      !isAffiliate
    ) {
      return toast.error("Designation is required.");
    }
    if (isAffiliate) {
      if (!form.commission_percent) {
        return toast.error("Commission percentage is required.");
      }
      if (
        refDetails?.commission_percent &&
        !(form.commission_percent < refDetails?.commission_percent)
      ) {
        return toast.error(
          "Commission percentage must be less than the referrer commission."
        );
      }
    }
    if (
      initialValues?.referred_by &&
      form.commission_percent > affiliateDetails?.data?.commission_percent
    ) {
      return toast.error(
        "Commission percentage must be less than the referrer commission."
      );
    }

    onSubmit({
      ...form,
      commission_percent: form.commission_percent
        ? Number(form.commission_percent)
        : null,
      minTrx: form.minTrx ? String(form.minTrx) : null,
      maxTrx: form.maxTrx ? String(form.maxTrx) : null,
    });
  };

  // inside component
  const {
    data: designationsData,
    isLoading: designationsLoading,
    error: designationsError,
  } = useDesignations();

  console.log(designationsData);
  // filter designations by selected role
  const filteredDesignations =
    (designationsData?.data || [])?.filter(
      (d) => d.adminUserType === form.role
    ) || [];

  const designationOptions = filteredDesignations.map((d) => ({
    value: d.id,
    label: d.designationName,
  }));

  useEffect(() => {
    if (!form.currency && currencyList) {
      const bdtCurrency = currencyList.find(
        (c) => c.id === 11 || c.code === "BDT"
      );
      if (bdtCurrency) {
        setForm((prev) => ({ ...prev, currency: bdtCurrency.id }));
      }
    }
  }, [currencyList]);

  useEffect(() => {
    if (refCodeFromUrl) {
      setForm((prev) => ({
        ...prev,
        refer_code: refCodeFromUrl,
        role: "affiliate",
      }));
    }
  }, [refCodeFromUrl]);

  // fetch referral details when debouncedRefCode changes
  const [refLoading, setRefLoading] = useState(false);
  const fetchReferralDetails = async () => {
    if (!debouncedRefCode) {
      setRefDetails(null);
      return;
    }

    setRefLoading(true); // ✅ Start loading
    try {
      const token = localStorage.getItem("token"); // ✅ Get token
      const response = await fetch(
        `${BASE_URL}${API_LIST.GET_DETAILS_BY_REFER_CODE}/${debouncedRefCode}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Add token in header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch referral details");
      }

      const data = await response.json();

      if (data?.data?.id) {
        const supAff = data?.data;
        setRefDetails(supAff);
        setForm((prev) => ({
          ...prev,
          commission_percent: supAff?.commission_percent
            ? Number(supAff?.commission_percent) / 2
            : null,
          role: "affiliate",
          minTrx: supAff?.minTrx || "",
          maxTrx: supAff?.maxTrx || "",
          currency: supAff?.currency || null,
        }));
      } else {
        setRefDetails(null);
      }
    } catch (error) {
      console.error("Error fetching referral details:", error);
      setRefDetails(null);
    } finally {
      setRefLoading(false); // ✅ Stop loading
    }
  };
  useEffect(() => {
    if (debouncedRefCode) {
      fetchReferralDetails();
    }
  }, [debouncedRefCode]);

  const getRequest = useGetRequest();

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      onSubmit={handleSubmit}
    >
      {/* role */}
      {!isAffiliate && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            ROLE <span className="text-red-500">*</span>
          </label>
          <select
            className="border rounded px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* designation */}
      {form.role && filteredDesignations.length > 0 && !isAffiliate && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            DESIGNATION <span className="text-red-500">*</span>
          </label>
          {designationsLoading ? (
            <p className="text-gray-500 text-sm">Loading designations...</p>
          ) : (
            <Select
              options={designationOptions}
              value={
                designationOptions.find(
                  (opt) => opt.value === form.designation
                ) || null
              }
              onChange={(selected) => {
                setForm((prev) => ({
                  ...prev,
                  designation: selected ? selected.value : "",
                }));
              }}
              isSearchable
              placeholder="Select Designation"
            />
          )}
        </div>
      )}

      {/* username */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          USERNAME <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>

      {/* fullname */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          FULL NAME <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />
      </div>

      {/* email */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          EMAIL ADDRESS <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* phone */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">
          PHONE NUMBER <span className="text-red-500">*</span>
        </label>
        <input
          className="border rounded px-3 py-2"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          type="text"
        />
      </div>

      {/* commission */}
      {isAffiliate && (
        <div className="flex flex-col relative">
          <label className="font-semibold text-xs mb-1">
            COMMISSION % <span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded px-3 py-2"
            name="commission_percent"
            placeholder="Commission %"
            value={form.commission_percent}
            onChange={handleChange}
            required
            type="number"
            readOnly={refLoading}
          />
          {refLoading && (
            <p className="text-blue-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-blue-500 bg-white rounded-full px-2">
              Upline Searching...
            </p>
          )}
        </div>
      )}
      {/* password */}
      {(!isEdit || !isAffiliate) && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            PASSWORD{" "}
            <span className={`text-red-500 ${isEdit && "hidden"}`}>*</span>
          </label>
          <div className="relative flex items-center">
            <input
              className="border rounded px-3 py-2 pr-10 w-full"
              name="password"
              type={showPassword || isEdit ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required={!isEdit}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      )}

      {/* currency */}
      <div className="flex flex-col relative">
        <label className="font-semibold text-xs mb-1">CURRENCY</label>
        {currencyLoading ? (
          <p className="text-gray-500 text-sm">Loading currencies...</p>
        ) : (
          <Select
            options={currencyOptions}
            value={
              currencyOptions.find((opt) => opt.value === form.currency) || null
            }
            onChange={(selected) => {
              setForm((prev) => ({
                ...prev,
                currency: selected ? selected.value : null,
              }));
            }}
            isSearchable
            placeholder="Select Currency"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: "300px",
                overflowY: "auto",
              }),
            }}
            isDisabled={refLoading}
          />
        )}
        {refLoading && (
          <p className="text-blue-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-blue-500 bg-white rounded-full px-2">
            Upline Searching...
          </p>
        )}
      </div>

      {/* address */}
      <div className="flex flex-col">
        <label className="font-semibold text-xs mb-1">Address</label>
        <input
          className="border rounded px-3 py-2"
          name="city"
          placeholder="Address"
          value={form.city}
          onChange={handleChange}
        />
      </div>

      {/* min/max trx */}
      {isAffiliate && user?.role !== "superAffiliate" && (
        <>
          <div className="flex flex-col relative">
            <label className="font-semibold text-xs mb-1">
              MINIMUM TRANSACTION <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="minTrx"
              type="number"
              min="0"
              placeholder="Minimum Transaction"
              value={form.minTrx}
              onChange={handleChange}
              required
              readOnly={
                refLoading ||
                (refDetails &&
                  (user?.role !== "admin" || user?.role !== "superAdmin"))
              }
            />
            {refLoading && (
              <p className="text-blue-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-blue-500 bg-white rounded-full px-2">
                Upline Searching...
              </p>
            )}
          </div>
          <div className="flex flex-col relative">
            <label className="font-semibold text-xs mb-1">
              MAXIMUM TRANSACTION <span className="text-red-500">*</span>
            </label>
            <input
              className="border rounded px-3 py-2"
              name="maxTrx"
              type="number"
              min="0"
              placeholder="Maximum Transaction"
              value={form.maxTrx}
              onChange={handleChange}
              required
              readOnly={refLoading}
            />
            {refLoading && (
              <p className="text-blue-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-blue-500 bg-white rounded-full px-2">
                Upline Searching...
              </p>
            )}
          </div>
        </>
      )}

      {staticAdminCheck(user.role) && (
        <div className="flex flex-col">
          <label className="font-semibold text-xs mb-1">
            STATUS <span className="text-red-500">*</span>
          </label>
          <select
            className="border rounded px-3 py-2"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      {/* referral code */}
      {isRefVisible && (
        <div className="flex flex-col relative">
          <label className="font-semibold text-xs mb-1">REFERRAL CODE</label>
          <input
            className={`border rounded px-3 py-2 ${
              refLoading ? "opacity-50" : ""
            }`}
            name="refer_code"
            placeholder="Referral Code"
            value={form.refer_code}
            onChange={handleChange}
            readOnly={refLoading}
            disabled={refLoading}
          />
          {refLoading ? (
            <p className="text-blue-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-blue-500 bg-white rounded-full px-2">
              Searching...
            </p>
          ) : refDetails ? (
            <p className="text-green-600 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-green-500 bg-white rounded-full px-2">
              Referral found: {refDetails?.fullname || refDetails?.username}
            </p>
          ) : debouncedRefCode ? (
            <p className="text-red-500 absolute bottom-[-13px] left-2 text-[12px] font-medium uppercase border border-red-500 bg-white rounded-full px-2">
              Invalid referral code
            </p>
          ) : null}
        </div>
      )}

      {/* button */}
      <div className="md:col-span-3 flex justify-end mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded font-medium transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLoading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update"
            : isAffiliate
            ? "Create Affiliate"
            : isOwner
            ? "Create Owner"
            : "Create Agent"}
        </button>
      </div>
    </form>
  );
}
