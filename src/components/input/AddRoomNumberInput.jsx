import React from "react";
import { Select, Form, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TagInput from "./TabInput"; // TabInput / TagInput
import { buildingSelector } from "../../service/buildingSlice";
import { useSelector } from "react-redux";

const AddRoomNumberInput = ({ field, remove, form }) => {
  const { data: building, isPending: isBuildingPending } =
    useSelector(buildingSelector);

  const selectedBuildingId = Form.useWatch(
    ["groups", field.name, "building_id"],
    form,
  );

  const selectedBuilding = building?.find(
    (item) => item?.id === selectedBuildingId,
  );

  const handleBuildingChange = () => {
    const groups = form.getFieldValue("groups");
    if (groups && groups[field.name]) {
      form.setFieldValue(["groups", field.name, "floor_id"], undefined);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => remove(field.name)}
        className="absolute! top-3! right-3! hover:bg-red-50!"
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Form.Item
          name={[field.name, "building_id"]}
          label={
            <span className="font-semibold text-gray-700">Building / Area</span>
          }
          rules={[{ required: true, message: "Required" }]}
          className="mb-0"
        >
          <Select
            placeholder="Select"
            size="large"
            className="w-full"
            loading={isBuildingPending}
            onChange={handleBuildingChange}
          >
            {building?.map((build) => (
              <Option key={build?.id} value={build?.id}>
                {build?.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={[field.name, "floor_id"]}
          label={<span className="font-semibold text-gray-700">Floor</span>}
          rules={[{ required: true, message: "Required" }]}
          className="mb-0"
        >
          <Select
            placeholder="Select"
            size="large"
            className="w-full"
            disabled={!selectedBuildingId}
          >
            {selectedBuilding?.floors?.map((floor) => (
              <Option key={floor?.id} value={floor?.id}>
                {floor?.name} Floor
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name={[field.name, "room_numbers"]}
        label={
          <span className="font-semibold text-gray-700">Room Numbers</span>
        }
        rules={[{ required: true, message: "Please enter at least one room" }]}
        className="mb-0"
      >
        <TagInput placeholder="Type room (e.g. M 301)" />
      </Form.Item>
    </div>
  );
};

export default AddRoomNumberInput;
