import React, { useState } from "react";
import LanguageList from "./LanguageList";
import CountryList from "./CountryList";
import CurrencyList from "./CurrencyList";
import { useCountryData } from "../hooks/useCountryData";

const CountryManagementPage = () => {
  const [activeTab, setActiveTab] = useState("languages");
  const { useCountries, useCurrencies, useLanguages } = useCountryData();

  // Prefetch data for all tabs
  const { data: countriesResponse } = useCountries({ status: "active" });
  const { data: currenciesResponse } = useCurrencies({ status: "active" });
  const { data: languagesResponse } = useLanguages({ status: "active" });

  // Extract arrays from API responses
  const countries = countriesResponse?.data || [];
  const currencies = currenciesResponse?.data || [];
  const languages = languagesResponse?.data || [];

  const tabs = [
    { id: "languages", label: "Languages", count: languages.length },
    { id: "countries", label: "Countries", count: countries.length },
    { id: "currencies", label: "Currencies", count: currencies.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "languages":
        return <LanguageList />;
      case "countries":
        return <CountryList />;
      case "currencies":
        return <CurrencyList />;
      default:
        return <LanguageList />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Country Management
          </h1>
          <p className="text-gray-600">
            Manage countries, currencies, and languages for your application
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
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
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">{renderTabContent()}</div>
    </div>
  );
};

export default CountryManagementPage;
