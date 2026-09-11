import React, { useState, useEffect } from "react";
import { Form, Input, Upload, Radio, Select, Button } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList || [];
};

const BuildingAndAreaForm = ({
  initialData = null,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData);

  const [floorType, setFloorType] = useState("single_floor");
  console.log("inin", initialData);
  useEffect(() => {
    if (initialData) {
      setFloorType(initialData.floor_type || "single_floor");

      form.setFieldsValue({
        name: initialData.name || "",
        floor_type: initialData.floor_type || "single_floor",
        floor_from: initialData.floor_from || "G",
        floor_to: initialData.floor_to || "10",
        image: initialData.imageUrl
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: initialData.imageUrl,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
      setFloorType("single_floor");
    }
  }, [initialData, form]);

  const handleFinish = (values) => {
    const uploadedFile =
      values.image?.[0]?.originFileObj || values.image?.[0]?.url || null;

    const payload = {
      ...values,
      image: uploadedFile,
    };

    if (onSubmit) {
      onSubmit(payload, isEditMode);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        floor_type: "single_floor",
        floor_from: "G",
        floor_to: "1",
        image: [],
      }}
      className="p-4 space-y-4"
    >
      <Form.Item
        label={
          <span className="text-xs font-semibold text-slate-700">
            Building and Area Name <span className="text-red-500">*</span>
          </span>
        }
        name="name"
        rules={[{ required: true, message: "Please enter building name" }]}
        className="mb-0"
      >
        <Input
          placeholder="Type Building and Area Name"
          className="h-12 rounded-xl bg-white border-slate-200 text-sm"
        />
      </Form.Item>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          Picture
        </label>
        <Form.Item
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          className="mb-0"
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            maxCount={1}
            className="w-full [&_.ant-upload]:w-full! [&_.ant-upload]:h-44! [&_.ant-upload]:rounded-2xl! [&_.ant-upload]:border-slate-200! [&_.ant-upload]:bg-white!"
          >
            {(form.getFieldValue("image") || []).length === 0 && (
              <div className="flex flex-col items-center justify-center text-indigo-400 space-y-1">
                <CameraOutlined className="text-3xl" />
                <span className="text-xs font-medium text-indigo-400">
                  Upload Image
                </span>
              </div>
            )}
          </Upload>
        </Form.Item>
      </div>

      <Form.Item name="floor_type" className="mb-0">
        <Radio.Group
          onChange={(e) => setFloorType(e.target.value)}
          value={floorType}
          className="w-full space-y-3"
        >
          <div
            onClick={() => {
              setFloorType("single_floor");
              form.setFieldsValue({ floor_type: "single_floor" });
            }}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start space-x-3 bg-white ${
              floorType === "single_floor"
                ? "border-indigo-600 ring-1 ring-indigo-600"
                : "border-slate-200"
            }`}
          >
            <Radio value="single_floor" className="mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-indigo-600 m-0">
                Single Floor
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                For properties without floors, such as bungalows, villas, or
                standalone units.
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              setFloorType("multi_floor");
              form.setFieldsValue({ floor_type: "multi_floor" });
            }}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start space-x-3 bg-white ${
              floorType === "multi_floor"
                ? "border-indigo-600 ring-1 ring-indigo-600"
                : "border-slate-200"
            }`}
          >
            <Radio value="multi_floor" className="mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-indigo-600 m-0">
                Multi Floor
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                For buildings with multiple floors where rooms are organized by
                floor.
              </p>
            </div>
          </div>
        </Radio.Group>
      </Form.Item>

      {floorType === "multi_floor" && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-semibold text-slate-700 block">
            Total Floor
          </span>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="floor_from" label="From" className="mb-0 text-xs">
              <Select className="w-full h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-slate-200!">
                <Option value="G">G</Option>
                {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                  <Option key={num} value={num.toString()}>
                    {num}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="floor_to" label="To" className="mb-0 text-xs">
              <Select className="w-full h-11 [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-slate-200!">
                {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                  <Option key={num} value={num.toString()}>
                    {num}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-6">
        <Button
          type="default"
          onClick={() => navigate(-1)}
          className="h-12 rounded-xl bg-slate-200/80 hover:bg-slate-300 border-none text-slate-700 font-bold text-xs"
        >
          Cancel
        </Button>

        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs border-none"
        >
          {isEditMode ? "Update" : "Create"}
        </Button>
      </div>
    </Form>
  );
};

export default BuildingAndAreaForm;
