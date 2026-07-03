import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  Breadcrumb,
  message,
} from "antd";
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const AddRoom = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    console.log("Form Submitted Data:", { ...values, photos: fileList });
    message.loading({ content: "Saving Room Data...", key: "updatable" });

    setTimeout(() => {
      message.success({
        content: "အခန်းအသစ်ကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။",
        key: "updatable",
        duration: 2,
      });
      navigate("/dashboard"); // ပြီးရင် dashboard ကို ပြန်ပို့မည်
    }, 1500);
  };

  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center"
          />
          <h1 className="font-title text-2xl font-bold text-on-surface">
            အခန်းအသစ်ထည့်သွင်းရန်
          </h1>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="font-sans"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
              <h2 className="font-title text-xl font-bold text-on-surface">
                အခန်းအချက်အလက်များ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Form.Item
                  label={
                    <span className="font-bold text-on-surface-variant text-xs">
                      Room Number
                    </span>
                  }
                  name="roomNumber"
                  rules={[
                    {
                      required: true,
                      message: "အခန်းနံပါတ် ထည့်သွင်းပေးပါရန်။",
                    },
                  ]}
                >
                  <Input
                    placeholder="e.g. 402"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200!"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold text-on-surface-variant text-xs">
                      Room Type
                    </span>
                  }
                  name="roomType"
                  initialValue="single"
                >
                  <Select
                    className="h-11! rounded-xl! w-full!"
                    options={[
                      { value: "single", label: "Single" },
                      { value: "double", label: "Double Standard" },
                      { value: "deluxe", label: "Deluxe Suite" },
                      { value: "presidential", label: "Presidential Suite" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold text-on-surface-variant text-xs">
                      Floor
                    </span>
                  }
                  name="floor"
                >
                  <Input
                    placeholder="4"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200!"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold text-on-surface-variant text-xs">
                      Price per Night
                    </span>
                  }
                  name="price"
                  rules={[
                    { required: true, message: "ဈေးနှုန်း ထည့်သွင်းပေးပါရန်။" },
                  ]}
                >
                  <Input
                    prefix={<span className="text-outline">$</span>}
                    placeholder="120.00"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200!"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="font-bold text-on-surface-variant text-xs">
                    Description
                  </span>
                }
                name="description"
              >
                <TextArea
                  rows={5}
                  placeholder="Describe the room's unique qualities and views..."
                  className="rounded-xl! bg-surface/30! border-slate-200! p-4!"
                />
              </Form.Item>

              <div className="space-y-4">
                <div className="font-bold text-on-surface-variant text-xs mb-3">
                  Features/Amenities
                </div>
                <Form.Item name="amenities">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                      <Checkbox value="wifi" className="text-sm! font-medium!">
                        Wi-Fi
                      </Checkbox>
                      <Checkbox value="ac" className="text-sm! font-medium!">
                        AC
                      </Checkbox>
                      <Checkbox value="tv" className="text-sm! font-medium!">
                        TV
                      </Checkbox>
                      <Checkbox
                        value="minibar"
                        className="text-sm! font-medium!"
                      >
                        Minibar
                      </Checkbox>
                      <Checkbox
                        value="cityview"
                        className="text-sm! font-medium!"
                      >
                        City View
                      </Checkbox>
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="font-title text-base font-bold text-on-surface">
                Room Photos
              </h2>
             
              <Form.Item name="photos">
                <Upload
                  action="https://660d2bd96ddfa1943b3bd318.mockapi.io/api/upload" // နမူနာ upload API
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  multiple
                >
                  {fileList.length >= 8 ? null : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <CloudUploadOutlined className="text-3xl! text-primary! mb-2!" />
                      <div className="text-[10px]! font-bold! text-on-surface!">
                        Click to upload or drag and drop
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            {/* Guidelines Card */}
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 flex space-x-4">
              <InfoCircleOutlined className="text-xl! text-primary! shrink-0!" />
              <div>
                <h4 className="font-bold text-primary text-sm mb-1">
                  Guidelines
                </h4>
                <p className="text-xs text-primary/70 leading-relaxed">
                  Please ensure the room number is unique and photos highlight
                  the main amenities to improve booking rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate(-1)}
            className="h-12! px-8! rounded-xl! font-bold! border-slate-200! text-on-surface-variant! hover:bg-slate-50! transition-all!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="h-12! px-8! rounded-xl! bg-primary! hover:bg-primary-container! font-bold! border-none! shadow-md! shadow-primary/20! transition-all! active:scale-95!"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddRoom;
