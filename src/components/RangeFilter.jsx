import { InputNumber, Space } from "antd";

export default function RangeFilter({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">{label}</label>
      <Space>
        <InputNumber
          placeholder="Min"
          value={value.min}
          onChange={(min) => onChange({ ...value, min })}
        />
        <span>—</span>
        <InputNumber
          placeholder="Max"
          value={value.max}
          onChange={(max) => onChange({ ...value, max })}
        />
      </Space>
    </div>
  );
}
