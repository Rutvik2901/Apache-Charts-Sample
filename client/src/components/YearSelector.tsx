import { Select } from "antd";
import React from "react";

interface Props {
    years: number[];
    value?: number;
    onChange: (year: number) => void;
}

const { Option } = Select;

const YearSelector: React.FC<Props> = ({ years, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Year
            </label>
            <Select
                value={value ?? undefined}
                style={{ width: 200 }}
                onChange={(value) => onChange(value)}
                placeholder="Select Year"
            >
                {years.map((year) => (
                    <Option key={year} value={year}>
                        {year}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default YearSelector;
