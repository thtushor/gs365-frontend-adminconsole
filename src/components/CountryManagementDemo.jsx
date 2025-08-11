import React, { useState } from "react";
import { useCountryData } from "../hooks/useCountryData";

const CountryManagementDemo = () => {
  const [activeTab, setActiveTab] = useState("languages");
  const {
    useCountries,
    useCurrencies,
    useLanguages,
    assignCountryLanguage,
    updateLanguageStatus,
    updateCountryStatus,
    isAssigningCountryLanguage,
    isUpdatingLanguageStatus,
    isUpdatingCountryStatus,
  } = useCountryData();

  // Get data with filters
  const { data: countriesResponse, isLoading: countriesLoading } = useCountries(
    {
      status: "active",
    }
  );
  const { data: currenciesResponse, isLoading: currenciesLoading } =
    useCurrencies({ status: "active" });
  const { data: languagesResponse, isLoading: languagesLoading } = useLanguages(
    {
      status: "active",
    }
  );

  // Extract arrays from API responses
  const countries = countriesResponse?.data || [];
  const currencies = currenciesResponse?.data || [];
  const languages = languagesResponse?.data || [];

  const handleAssignLanguage = () => {
    assignCountryLanguage({
      countryId: 1,
      languageId: 2,
      status: "active",
    });
  };

  const handleUpdateLanguageStatus = () => {
    updateLanguageStatus({
      id: 1,
      status: "inactive",
    });
  };

  const handleUpdateCountryStatus = () => {
    updateCountryStatus({
      id: 1,
      status: "inactive",
    });
  };

  const tabs = [
    {
      id: "languages",
      label: "Languages",
      count: languages.length,
      loading: languagesLoading,
    },
    {
      id: "countries",
      label: "Countries",
      count: countries.length,
      loading: countriesLoading,
    },
    {
      id: "currencies",
      label: "Currencies",
      count: currencies.length,
      loading: currenciesLoading,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Country Management API Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This demo shows the API integration for countries, currencies, and
            languages. The data is fetched using React Query and cached for
            optimal performance.
          </p>

          {/* API Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleAssignLanguage}
              disabled={isAssigningCountryLanguage}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isAssigningCountryLanguage ? "Assigning..." : "Assign Language"}
            </button>
            <button
              onClick={handleUpdateLanguageStatus}
              disabled={isUpdatingLanguageStatus}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdatingLanguageStatus
                ? "Updating..."
                : "Update Language Status"}
            </button>
            <button
              onClick={handleUpdateCountryStatus}
              disabled={isUpdatingCountryStatus}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {isUpdatingCountryStatus
                ? "Updating..."
                : "Update Country Status"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.loading ? "..." : tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "languages" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Languages Data</h3>
                {languagesLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="mt-2 text-gray-600">Loading languages...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {languages.map((lang, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{lang.name}</h4>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                            {lang.code}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            lang.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lang.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "countries" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Countries Data</h3>
                {countriesLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="mt-2 text-gray-600">Loading countries...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countries.map((country, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{country.name}</h4>
                        <p className="text-gray-600">Code: {country.code}</p>
                        <p className="text-gray-600">
                          Currency: {country.currency}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            country.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {country.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "currencies" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Currencies Data</h3>
                {currenciesLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="mt-2 text-gray-600">Loading currencies...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currencies.map((currency, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{currency.name}</h4>
                          <span className="text-lg font-bold">
                            {currency.symbol}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Code:{" "}
                          <span className="font-mono bg-gray-100 px-1 rounded">
                            {currency.code}
                          </span>
                        </p>
                        {currency.symbol_native && (
                          <p className="text-gray-600">
                            Native: {currency.symbol_native}
                          </p>
                        )}
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            currency.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {currency.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryManagementDemo;
