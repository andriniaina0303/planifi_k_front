import React from "react";
import { Select, Divider, Row, Col } from "antd";

const { Option } = Select;

export default function MultiSelectAnt({
  placeholder,
  options,
  value,
  setValue,
  showFlag = false,
}) {
  const getLabel = (o) => {
    if (typeof o === "object")
      return `${showFlag ? o.flag + " " : ""}${o.name}`;
    return o;
  };

  const getCode = (o) => (typeof o === "object" ? o.code : o);

  const handleSelectAll = () => {
    if (value.length === options.length) setValue([]);
    else setValue(options.map(getCode));
  };

  return (
    <div className="mb-4">
      <Row>
        <Col span={7} style={{textAlign: "center", padding: 5}}>
          <label className="form-label">{placeholder}</label>
        </Col>

        <Col span={17}>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder={`Sélectionnez ${placeholder}`}
            value={value}
            onChange={setValue}
            optionLabelProp="label"
            dropdownRender={(menu) => (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", padding: 8 }}>
                  <a
                    style={{
                      flex: "1 0 100%",
                      marginBottom: 8,
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleSelectAll}
                  >
                    {value.length === options.length
                      ? "Désélectionner tous"
                      : "Sélectionner tous"}
                  </a>
                </div>
                <Divider style={{ margin: "4px 0" }} />
                {menu}
              </>
            )}
          >
            {options.map((o) => {
              const code = getCode(o);
              return (
                <Option key={code} value={code} label={getLabel(o)}>
                  {getLabel(o)}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
    </div>
  );
}
