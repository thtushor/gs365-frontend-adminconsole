import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGetRequest, usePostRequest } from "../../Utils/apiClient";
import { API_LIST, BASE_URL, SINGLE_IMAGE_UPLOAD_URL } from "../../api/ApiList";
import { toast } from "react-toastify";
import { MdToggleOff, MdToggleOn } from "react-icons/md";

const defaultForm = {
  name: "",
  parentId: "",
  status: "inactive",
  apiKey: "",
  licenseKey: "",
  gameLogo: "",
  secretPin: "",
  gameUrl: "",
  ggrPercent: "",
  categoryId: "",
  providerId: "",
  isFavorite: false,
};

const AddOrUpdateGame = () => {
  const [parentProviderId, setParentProviderId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const getRequest = useGetRequest();
  const postRequest = usePostRequest();

  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get("gameId");

  const isEditMode = !!gameId;

  // ✅ Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL + API_LIST.GET_DROPDOWN}?id=2`,
      }),
    select: (res) =>
      res?.data?.options?.filter((opt) => opt.status === "active") || [],
  });

  // ✅ Fetch parent providers
  const { data: providers = [] } = useQuery({
    queryKey: ["game_providers", { publicList: true, isParent: true }],
    queryFn: () =>
      getRequest({
        url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
        params: { publicList: true, isParent: true },
        errorMessage: "Failed to fetch parent provider list",
      }),
    select: (res) => res?.data || [],
  });
  // ✅ Fetch child providers
  const { data: childProviders = [], isLoading: childProviderLoading } =
    useQuery({
      queryKey: [
        "child_game_providers",
        { publicList: true, parentId: parentProviderId },
      ],
      queryFn: () =>
        getRequest({
          url: BASE_URL + API_LIST.GET_GAME_PROVIDER,
          params: { publicList: true, parentId: parentProviderId },
          errorMessage: "Failed to fetch parent provider list",
        }),
      enabled: !!parentProviderId,
    });

  // ✅ Prefill form in edit mode
  const handleUpdatedData = (fetchData) => {
    const data = fetchData?.data;
    if (!data) return;

    if (data?.providerInfo?.parentId) {
      setParentProviderId(data?.providerInfo?.parentId);
    }
    setForm({
      name: data.name || "",
      parentId: data.parentId || "",
      status: data.status || "inactive",
      apiKey: data.apiKey || "",
      licenseKey: data.licenseKey || "",
      gameLogo: data.gameLogo || "",
      secretPin: data.secretPin || "",
      gameUrl: data.gameUrl || "",
      ggrPercent: data.ggrPercent || "",
      categoryId: gameId
        ? data.categoryInfo?.id?.toString()
        : data.categoryInfo?.id
        ? data.categoryInfo?.id?.toString()
        : "",
      providerId: gameId
        ? data.providerInfo?.id?.toString()
        : data.providerInfo?.id
        ? data.providerInfo?.id?.toString()
        : "",
      isFavorite: data.isFavorite || false,
    });
  };

  // ✅ Fetch single game if editing
  useQuery({
    queryKey: ["game", gameId],
    queryFn: () =>
      getRequest({
        url: `${BASE_URL + API_LIST.GET_GAMES}`,
        params: { id: gameId },
        errorMessage: "Failed to fetch game details",
        onSuccessFn: handleUpdatedData,
      }),
    keepPreviousData: true,
    enabled: !!gameId,
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Validate form
  const validate = () => {
    // List of required fields and their error messages
    const requiredFields = [
      { key: "name", message: "Name is required" },
      { key: "apiKey", message: "API Key is required" },
      { key: "licenseKey", message: "License Key is required" },
      { key: "secretPin", message: "Secret Pin is required" },
      { key: "gameUrl", message: "Game URL is required" },
      { key: "ggrPercent", message: "GGR Percent is required" },
      { key: "categoryId", message: "Category is required" },
      { key: "providerId", message: "Provider is required" },
    ];

    // Validate text fields (check non-empty strings after trimming)
    for (const field of requiredFields) {
      const value = form[field.key];
      if (typeof value === "string" && !value.trim()) {
        toast.error(field.message);
        return false;
      }
      // For non-string fields (like IDs), just check existence
      if (typeof value !== "string" && !value) {
        toast.error(field.message);
        return false;
      }
    }

    // Special validation for gameLogo: required if not editing
    if (!isEditMode && !form.gameLogo) {
      toast.error("Game Logo is required");
      return false;
    }

    return true;
  };

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        ...formData,
        id: gameId || undefined,
      };

      return await postRequest({
        url: BASE_URL + API_LIST.CREATE_UPDATE_GAME,
        body: payload,
        contentType: "application/json",
        setLoading: setSubmitLoading,
        onSuccessFn: handleUpdatedData,
        successMessage: gameId
          ? "Game updated successfully"
          : "Game created successfully",
      });
    },
    onSuccess: () => {
      if (!gameId) setForm(defaultForm);
    },
  });

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitLoading(true);
      let gameLogo = form.gameLogo;

      if (gameLogo instanceof File) {
        const imageForm = new FormData();
        imageForm.append("file", gameLogo);

        const res = await fetch(SINGLE_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: imageForm,
        });

        const data = await res.json();
        if (!data?.status || !data?.data?.original) {
          toast.error("Image upload failed");
          return;
        }

        gameLogo = data.data.original;
      }

      const formWithLogo = {
        ...form,
        gameLogo,
      };

      mutation.mutate(formWithLogo);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleGetSubProvider = (e) => {
    const { name, value } = e.target;
    if (name === "parentProviderId") {
      setParentProviderId(value);
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen p-6">
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 pt-4 border border-green-400 rounded"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between col-span-full w-full">
          <h2 className="text-xl font-semibold mb-4">
            {isEditMode ? "Update Game" : "Add New Game"}
          </h2>
          <button
            className="bg-green-500 cursor-pointer text-white px-4 py-1 rounded hover:bg-green-600 transition text-sm font-medium"
            onClick={() => navigate("/game-list")}
            type="button"
          >
            Game List
          </button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Game Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="Enter your game name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Game Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Select Parent Provider
          </label>
          <select
            name="parentProviderId"
            value={parentProviderId}
            onChange={handleGetSubProvider}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Parent Provider</option>
            {providers.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className={`${
            (!parentProviderId ||
              childProviders?.data?.length < 1 ||
              childProviderLoading) &&
            "opacity-50"
          }`}
        >
          <label className="block mb-1 font-medium">Select Sub Provider</label>
          <select
            name="providerId"
            value={form.providerId}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              (!parentProviderId ||
                childProviders?.data?.length < 1 ||
                childProviderLoading) &&
              "opacity-50 pointer-events-none select-none"
            }`}
            required
          >
            <option value="">
              {childProviderLoading
                ? "Loading..."
                : parentProviderId && childProviders?.data?.length < 1
                ? "Sub Provider Not Available"
                : "Select Sub Provider"}
            </option>
            {childProviders?.data?.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Game API Key</label>
          <input
            type="text"
            name="apiKey"
            value={form.apiKey}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="Enter your game api key"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Game License Key</label>
          <input
            type="text"
            name="licenseKey"
            value={form.licenseKey}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="Enter your game license key"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Game Secret Pin</label>
          <input
            type="text"
            name="secretPin"
            value={form.secretPin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="Enter your game secret pin"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Game URL</label>
          <input
            type="text"
            name="gameUrl"
            value={form.gameUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            placeholder="Enter your game url"
          />
        </div>

        <div className="col-span-full sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 grid  gap-4">
          <div>
            <label className="block mb-1 font-medium">GGR Percent</label>
            <input
              type="number"
              name="ggrPercent"
              value={form.ggrPercent}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              placeholder="Enter your GGR%"
            />
          </div>
          <div className="col-span-full sm:col-span-1">
            <label className="block mb-1 font-medium">Game Thumbnail</label>
            <input
              type="file"
              name="gameLogo"
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            {typeof form.gameLogo === "string" && form.gameLogo && (
              <img
                src={form.gameLogo}
                alt="Logo"
                className="mt-2 h-20 rounded-md"
              />
            )}
          </div>

          <div className="col-span-full sm:col-span-1">
            <label className="block mb-1 font-medium">Game Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-full sm:col-span-1">
            <label className="block mb-1 font-medium">Is Favorite?</label>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, isFavorite: !prev.isFavorite }))
              }
              className="w-full border px-3 py-[3px] rounded cursor-pointer"
            >
              {form.isFavorite ? (
                <MdToggleOn className="text-green-500" size={33} />
              ) : (
                <MdToggleOff className="text-red-500" size={33} />
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 cursor-pointer py-2 rounded hover:bg-green-600 transition"
            disabled={submitLoading}
          >
            {submitLoading
              ? "Submitting..."
              : gameId
              ? "Update Game"
              : "Create Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrUpdateGame;
