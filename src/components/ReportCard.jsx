const ReportCard = ({ title, value, highlight = "", className = "" }) => (
  <div className={`bg-white rounded shadow p-4 text-center ${className}`}>
    <div className="text-xs text-gray-500">{title}</div>
    <div className={`text-lg font-bold ${highlight}`}>{value}</div>
  </div>
);

export default ReportCard;
