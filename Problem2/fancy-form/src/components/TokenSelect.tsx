export const TokenSelect = ({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">Select Token</option>
      {options.map((token) => (
        <option key={token} value={token}>
          {token}
        </option>
      ))}
    </select>
  </div>
);
