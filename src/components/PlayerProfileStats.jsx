import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaGlobe,
  FaShieldAlt,
} from "react-icons/fa";

const PlayerProfileStats = ({ playerDetails }) => {
  if (!playerDetails) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaUser className="text-green-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{playerDetails.fullname}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium">@{playerDetails.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{playerDetails.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{playerDetails.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendar className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Created Date</p>
              <p className="font-medium">
                {formatDate(playerDetails.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  playerDetails.status
                )}`}
              >
                {playerDetails.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaGlobe className="text-blue-500" />
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Currency</p>
            <p className="font-medium">
              {playerDetails.currency?.code} ({playerDetails.currency?.name})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">User Type</p>
            <p className="font-medium capitalize">
              {playerDetails.userType?.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Device Type</p>
            <p className="font-medium">
              {playerDetails.device_type || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IP Address</p>
            <p className="font-medium">{playerDetails.ip_address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{formatDate(playerDetails.lastLogin)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Verified</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                playerDetails.isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {playerDetails.isVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Referrer Information */}
      {playerDetails.referrerDetails && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUser className="text-purple-500" />
            Referrer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Referrer Type</p>
              <p className="font-medium capitalize">
                {playerDetails.referrerType}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrer Name</p>
              <p className="font-medium">
                {playerDetails.referrerDetails.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrer Username</p>
              <p className="font-medium">
                @{playerDetails.referrerDetails.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrer Role</p>
              <p className="font-medium capitalize">
                {playerDetails.referrerDetails.role}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrer Phone</p>
              <p className="font-medium">
                {playerDetails.referrerDetails.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrer Email</p>
              <p className="font-medium">
                {playerDetails.referrerDetails.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commission %</p>
              <p className="font-medium">
                {playerDetails.referrerDetails.commission || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {playerDetails.recentTransactions
                ?.slice(0, 5)
                .map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.givenTransactionId ||
                        transaction.customTransactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "win"
                            ? "bg-green-100 text-green-800"
                            : transaction.type === "loss"
                            ? "bg-red-100 text-red-800"
                            : transaction.type === "deposit"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      BDT {parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs capitalize font-medium ${
                          transaction.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bet Results */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bet Results</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Win/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Multiplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {playerDetails.recentBetResults?.slice(0, 5).map((bet) => (
                <tr key={bet.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bet.gameName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    BDT {parseFloat(bet.betAmount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bet.betStatus === "win"
                          ? "bg-green-100 text-green-800"
                          : bet.betStatus === "loss"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bet.betStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {bet.betStatus === "win" ? (
                      <span className="text-green-600 font-medium">
                        +BDT {parseFloat(bet.winAmount).toFixed(2)}
                      </span>
                    ) : bet.betStatus === "loss" ? (
                      <span className="text-red-600 font-medium">
                        -BDT {parseFloat(bet.lossAmount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parseFloat(bet.multiplier).toFixed(2)}x
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(bet.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileStats;
