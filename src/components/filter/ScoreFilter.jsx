import { Select, InputNumber, Space, Row, Col } from "antd";

const operators = [
  { value: "=", label: "=" },
  { value: "<", label: "<" },
  { value: "<=", label: "≤" },
  { value: ">", label: ">" },
  { value: ">=", label: "≥" },
];

export default function ScoreFilter({
  label,
  value,
  onChange,
  min = 0,
  max = 3,
}) {
  return (
    <div className="mb-4">
      <Row>
        <Col span={10} style={{textAlign: "center", padding: 5}}>
          {label}
        </Col>
        <Space>
        <Col span={4}>
          <Select
            className="centered-select"
            value={value.operator}
            onChange={(op) => onChange({ ...value, operator: op })}
            style={{ width: 80, textAlign: "center" }}
            options={operators}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            className="centered-input"
            min={min}
            max={max}
            value={value.value}
            onChange={(val) => onChange({ ...value, value: val })}
          />
        </Col>
        </Space>
      </Row>
    </div>
  );
}
