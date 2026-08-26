import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const RoomStep1Form = ({ fileList, setFileList }) => {
  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          BASIC INFO
        </h2>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Type Name *
            </span>
          }
          name="room_type_name"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Input className="rounded-lg h-10 text-xs bg-slate-50/50" />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Standard *
            </span>
          }
          name="room_standard"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Select className="h-10 text-xs">
            <Select.Option value="Standard Room">Standard Room</Select.Option>
            <Select.Option value="Deluxe Room">Deluxe Room</Select.Option>
            <Select.Option value="Suite">Suite</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Build Type *
            </span>
          }
          name="room_build_type"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Select className="h-10 text-xs">
            <Select.Option value="Cottage">Cottage</Select.Option>
            <Select.Option value="Villa">Villa</Select.Option>
            <Select.Option value="Building">Building</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Description
            </span>
          }
          name="description"
          className="mb-0"
        >
          <TextArea rows={3} className="rounded-lg text-xs bg-slate-50/50" />
        </Form.Item>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          OCCUPANCY LIMITS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Maximum Adults *
              </span>
            }
            name="max_adults"
            rules={[{ required: true, message: "Required" }]}
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              {[1, 2, 3, 4, 5].map((num) => (
                <Select.Option key={num} value={String(num)}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Maximum Children *
              </span>
            }
            name="max_children"
            rules={[{ required: true, message: "Required" }]}
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              {[0, 1, 2, 3, 5, 10].map((num) => (
                <Select.Option key={num} value={String(num)}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          TYPICAL ROOM SIZE (RANGE)
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">From</span>
            }
            name="size_from"
            className="mb-0"
          >
            <Input className="rounded-lg h-10 text-xs bg-slate-50/50" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">To</span>
            }
            name="size_to"
            className="mb-0"
          >
            <Input className="rounded-lg h-10 text-xs bg-slate-50/50" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Area Unit
              </span>
            }
            name="area_unit"
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              <Select.Option value="sqft">sqft</Select.Option>
              <Select.Option value="sqm">sqm</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <Upload
        multiple
        listType="picture"
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
        accept="image/*"
        className="w-full block"
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1"
        >
          Upload Images
        </Button>
      </Upload>
    </>
  );
};

export default RoomStep1Form;
