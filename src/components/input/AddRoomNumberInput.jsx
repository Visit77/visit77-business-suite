// AddRoomNumberInput.jsx
import React from "react";
import { Form, Select, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { buildingSelector } from "../../service/buildingSlice";

export default function AddRoomNumberInput({ isUpdate, form }) {
  const { data: buildingList } = useSelector(buildingSelector);

  // Form Value ပြောင်းတိုင်း Re-render ဖြစ်အောင် Form.useWatch သုံးပေးရပါမည်
  const selectedBuilding = Form.useWatch("building", form);
  const groupsValue = Form.useWatch("groups", form);

  const getFloorOptions = (buildingId) => {
    const selected = buildingList?.find((b) => b.id === buildingId);
    return (
      selected?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) || []
    );
  };

  if (isUpdate) {
    return (
      <div className="bg-white p-4 rounded-xl space-y-4 mb-4 border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="building"
            label="Building / Area"
            rules={[{ required: true, message: "Building is required" }]}
          >
            <Select
              placeholder="Select Building"
              options={buildingList?.map((b) => ({
                label: b.name,
                value: b.id,
              }))}
              onChange={() => form.setFieldValue("floor", undefined)}
            />
          </Form.Item>

          <Form.Item
            name="floor"
            label="Floor"
            rules={[{ required: true, message: "Floor is required" }]}
          >
            <Select
              placeholder="Select Floor"
              options={getFloorOptions(selectedBuilding)}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="room_no"
          label="Room Number"
          rules={[{ required: true, message: "Room number is required" }]}
        >
          <Input placeholder="e.g. G 10001" />
        </Form.Item>
      </div>
    );
  }

  return (
    <Form.List
      name="groups"
      initialValue={[
        { building: undefined, floor: undefined, room_numbers: [] },
      ]}
    >
      {(fields, { add, remove }) => (
        <div className="space-y-4 mb-4">
          {fields.map(({ key, name, ...restField }) => {
            const currentBuilding = groupsValue?.[name]?.building;

            return (
              <div
                key={key}
                className="bg-white p-4 rounded-xl border border-gray-100 space-y-4 relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, "building"]}
                    label="Building / Area"
                    rules={[{ required: true, message: "Select building" }]}
                  >
                    <Select
                      placeholder="Select Building"
                      options={buildingList?.map((b) => ({
                        label: b.name,
                        value: b.id,
                      }))}
                      onChange={() => {
                        // Building ချိန်းရင် အဲ့ဒီ Index ရဲ့ floor တန်ဖိုးကို clear လုပ်ပေးခြင်း
                        const currentGroups =
                          form.getFieldValue("groups") || [];
                        if (currentGroups[name]) {
                          currentGroups[name].floor = undefined;
                          form.setFieldsValue({ groups: [...currentGroups] });
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "floor"]}
                    label="Floor"
                    rules={[{ required: true, message: "Select floor" }]}
                  >
                    <Select
                      placeholder="Select Floor"
                      options={getFloorOptions(currentBuilding)}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  {...restField}
                  name={[name, "room_numbers"]}
                  label="Room Number"
                  rules={[
                    { required: true, message: "Room number is required" },
                  ]}
                >
                  <Select
                    mode="tags"
                    placeholder="Type room number and press enter"
                  />
                </Form.Item>

                {fields.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                    className="absolute! top-2! right-2!"
                  />
                )}
              </div>
            );
          })}

          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
            Add More Group
          </Button>
        </div>
      )}
    </Form.List>
  );
}
