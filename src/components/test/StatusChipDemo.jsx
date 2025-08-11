import React, { useState } from "react";
import StatusChip, {
  STATUS_CONFIGS,
  createStatusConfig,
} from "../shared/StatusChip";

const StatusChipDemo = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Custom status configurations
  const customStatuses = {
    premium: createStatusConfig(
      "Premium",
      "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
      "⭐"
    ),
    beta: createStatusConfig(
      "Beta",
      "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200",
      "β"
    ),
    new: createStatusConfig(
      "New",
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
      "🆕"
    ),
    featured: createStatusConfig(
      "Featured",
      "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200",
      "🔥"
    ),
  };

  const handleStatusClick = (status, config) => {
    setSelectedStatus({ status, config });
    console.log("Status clicked:", status, config);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-full p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          StatusChip Component Demo
        </h1>

        {/* Basic Usage */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="active" />
            <StatusChip status="inactive" />
            <StatusChip status="pending" />
            <StatusChip status="success" />
            <StatusChip status="error" />
            <StatusChip status="warning" />
          </div>
        </section>

        {/* Size Variants */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">xs</span>
              <StatusChip status="active" size="xs" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">sm</span>
              <StatusChip status="active" size="sm" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">md</span>
              <StatusChip status="active" size="md" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">lg</span>
              <StatusChip status="active" size="lg" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">xl</span>
              <StatusChip status="active" size="xl" />
            </div>
          </div>
        </section>

        {/* Style Variants */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Style Variants</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">Default</span>
              <StatusChip status="active" variant="default" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">
                Outlined
              </span>
              <StatusChip status="active" variant="outlined" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">Filled</span>
              <StatusChip status="active" variant="filled" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">Pill</span>
              <StatusChip status="active" variant="pill" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">Square</span>
              <StatusChip status="active" variant="square" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-600">Minimal</span>
              <StatusChip status="active" variant="minimal" />
            </div>
          </div>
        </section>

        {/* All Predefined Statuses */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            All Predefined Statuses
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(STATUS_CONFIGS).map(([key, config]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <StatusChip status={key} />
                <span className="text-xs text-gray-500">{key}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Statuses */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Custom Statuses</h2>
          <div className="flex flex-wrap gap-3">
            <StatusChip customConfig={customStatuses.premium} />
            <StatusChip customConfig={customStatuses.beta} />
            <StatusChip customConfig={customStatuses.new} />
            <StatusChip customConfig={customStatuses.featured} />
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Interactive Examples</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <StatusChip
              status="active"
              onClick={handleStatusClick}
              className="hover:shadow-md"
            />
            <StatusChip
              status="pending"
              onClick={handleStatusClick}
              className="hover:shadow-md"
            />
            <StatusChip
              status="error"
              onClick={handleStatusClick}
              className="hover:shadow-md"
            />
            <StatusChip
              customConfig={customStatuses.premium}
              onClick={handleStatusClick}
              className="hover:shadow-md"
            />
          </div>
          {selectedStatus && (
            <div className="p-3 bg-gray-50 rounded border">
              <p className="text-sm">
                <strong>Clicked:</strong> {selectedStatus.status} -{" "}
                {selectedStatus.config.label}
              </p>
            </div>
          )}
        </section>

        {/* Without Icons */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Without Icons</h2>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="active" showIcon={false} />
            <StatusChip status="inactive" showIcon={false} />
            <StatusChip status="pending" showIcon={false} />
            <StatusChip status="success" showIcon={false} />
            <StatusChip status="error" showIcon={false} />
            <StatusChip status="warning" showIcon={false} />
          </div>
        </section>

        {/* Disabled State */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Disabled State</h2>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="active" disabled />
            <StatusChip status="inactive" disabled />
            <StatusChip status="pending" disabled />
            <StatusChip status="success" disabled />
            <StatusChip status="error" disabled />
            <StatusChip status="warning" disabled />
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Payment Status</h3>
              <div className="flex gap-2">
                <StatusChip status="paid" />
                <StatusChip status="unpaid" />
                <StatusChip status="pending" />
              </div>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">User Status</h3>
              <div className="flex gap-2">
                <StatusChip status="online" />
                <StatusChip status="offline" />
                <StatusChip status="enabled" />
                <StatusChip status="disabled" />
              </div>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Priority Levels</h3>
              <div className="flex gap-2">
                <StatusChip status="high" />
                <StatusChip status="medium" />
                <StatusChip status="low" />
              </div>
            </div>

            <div className="p-4 border rounded">
              <h3 className="font-medium mb-2">Process Status</h3>
              <div className="flex gap-2">
                <StatusChip status="processing" />
                <StatusChip status="completed" />
                <StatusChip status="cancelled" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatusChipDemo;
