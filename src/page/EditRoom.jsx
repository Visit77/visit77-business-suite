import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  message,
  Image,
} from "antd";
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const EditRoom = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Image List State for Upload and Preview Syncing
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "cover.png",
      status: "done",
      url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600",
    },
  ]);

  // Preview Handling States
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Form Initial Values (Edit Mode အတွက် Data ကြိုထည့်ထားပေးခြင်း)
  const initialData = {
    roomNumber: "101",
    roomType: "deluxe",
    floor: "1",
    price: "350.00",
    description:
      "The Deluxe Suite at LuxeManage offers a sanctuary of luxury and comfort. Featuring a panoramic city view, premium Italian marble bathroom with a deep soaking tub, and a bespoke king-size bed with 800-thread-count Egyptian cotton linens. Designed for the discerning traveler, it combines modern technology with timeless elegance.",
    amenities: ["wifi", "ac", "tv", "cityview"],
  };

  const onFinish = (values) => {
    message.loading({ content: "Updating Room Data...", key: "updatable" });

    setTimeout(() => {
      message.success({
        content: "အခန်းအချက်အလက်များကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။",
        key: "updatable",
        duration: 2,
      });
      navigate(-1);
    }, 1200);
  };

  // Upload ပုံပြောင်းလဲမှုကို ထိန်းချုပ်ခြင်း
  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  // Upload ထဲက ပုံငယ်လေးတွေကို နှိပ်ရင် Next/Prev Preview Group ပွင့်လာစေရန်
  const handlePreview = async (file) => {
    const index = fileList.findIndex((item) => item.uid === file.uid);
    setPreviewIndex(index >= 0 ? index : 0);
    setPreviewVisible(true);
  };

  return (
    <div className="space-y-6! animate-fade-in! pb-10! font-sans!">
      {/* 1. AntD Image Preview Group (Next/Prev ကြည့်နိုင်ရန် Hidden ထားသည်) */}
      <div className="hidden!">
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            current: previewIndex,
            onVisibleChange: (visible) => setPreviewVisible(visible),
            onChange: (index) => setPreviewIndex(index),
          }}
        >
          {fileList.map((file, idx) => (
            <Image key={idx} src={file.url || file.preview} />
          ))}
        </Image.PreviewGroup>
      </div>

      {/* 2. Top Header Section */}
      <div className="flex! flex-col! space-y-2!">
        <div className="flex! items-center! space-x-4!">
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex! items-center! justify-center! hover:bg-slate-100!"
          />
          <h1 className="font-title! text-xl! md:text-2xl! font-bold! text-on-surface!">
            Edit Room: Room {initialData.roomNumber}
          </h1>
        </div>
      </div>

      {/* 3. Main Form Section */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
        autoComplete="off"
        requiredMark={false}
      >
        <div className="grid! grid-cols-1! lg:grid-cols-3! gap-6! md:gap-8!">
          {/* Left Column: Core Fields Card */}
          <div className="lg:col-span-2! space-y-6!">
            <div className="bg-white! p-5! md:p-8! rounded-3xl! border! border-slate-100! shadow-sm! space-y-6! md:space-y-8!">
              <div className="grid! grid-cols-1! md:grid-cols-2! gap-x-6! md:gap-x-8! gap-y-5!">
                <Form.Item
                  label={
                    <span className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                      Room Number
                    </span>
                  }
                  name="roomNumber"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="e.g. 402"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200! font-medium!"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                      Room Type
                    </span>
                  }
                  name="roomType"
                >
                  <Select
                    className="h-11! rounded-xl! w-full! font-medium!"
                    options={[
                      { value: "single", label: "Single Room" },
                      { value: "double", label: "Double Deluxe" },
                      { value: "deluxe", label: "Deluxe Suite" },
                      { value: "presidential", label: "Presidential Suite" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                      Floor
                    </span>
                  }
                  name="floor"
                >
                  <Input
                    placeholder="4"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200! font-medium!"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                      Price per Night
                    </span>
                  }
                  name="price"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    prefix={
                      <span className="text-outline! font-semibold! text-sm! mr-1!">
                        $
                      </span>
                    }
                    placeholder="120.00"
                    className="h-11! rounded-xl! bg-surface/30! border-slate-200! font-medium!"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                    Description
                  </span>
                }
                name="description"
              >
                <TextArea
                  rows={5}
                  placeholder="Describe the room's unique qualities and views..."
                  className="rounded-xl! bg-surface/30! border-slate-200! p-4! text-sm! font-medium! leading-relaxed!"
                />
              </Form.Item>

              {/* Amenities Checkbox Segment */}
              <div className="space-y-3!">
                <div className="font-bold! text-on-surface-variant! text-xs! tracking-wide!">
                  Features / Amenities
                </div>
                <Form.Item name="amenities" className="mb-0!">
                  <Checkbox.Group className="w-full!">
                    <div className="grid! grid-cols-2! sm:grid-cols-3! gap-y-4!">
                      <Checkbox
                        value="wifi"
                        className="text-sm! font-semibold! text-slate-700!"
                      >
                        Wi-Fi
                      </Checkbox>
                      <Checkbox
                        value="ac"
                        className="text-sm! font-semibold! text-slate-700!"
                      >
                        AC
                      </Checkbox>
                      <Checkbox
                        value="tv"
                        className="text-sm! font-semibold! text-slate-700!"
                      >
                        TV
                      </Checkbox>
                      <Checkbox
                        value="minibar"
                        className="text-sm! font-semibold! text-slate-700!"
                      >
                        Minibar
                      </Checkbox>
                      <Checkbox
                        value="cityview"
                        className="text-sm! font-semibold! text-slate-700!"
                      >
                        City View
                      </Checkbox>
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Media & Guide Card */}
          <div className="space-y-6!">
            <div className="bg-white! p-6! rounded-3xl! border! border-slate-100! shadow-sm! space-y-5!">
              <h2 className="font-title! text-base! font-bold! text-on-surface!">
                Room Photos
              </h2>

              <Form.Item
                name="photos"
                className="mb-0! [&>.ant-row]:justify-start!"
              >
                <Upload
                  action="https://660d2bd96ddfa1943b3bd318.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  onPreview={handlePreview}
                  multiple
                  className="[&>.ant-upload-select]:rounded-2xl! [&>.ant-upload-list-item-container]:rounded-2xl! [&_.ant-upload-list-item]:rounded-2xl!"
                >
                  {fileList.length >= 6 ? null : (
                    <div className="flex! flex-col! items-center! justify-center! p-2!">
                      <CloudUploadOutlined className="text-2xl! text-primary! mb-2!" />
                      <div className="text-[10px]! font-bold! text-slate-500! text-center! leading-snug!">
                        Click to upload or
                        <br />
                        drag and drop
                      </div>
                      <div className="text-[9px]! text-slate-400! mt-1!">
                        PNG, JPG (Max. 5MB)
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <p className="text-[11px]! text-slate-400! font-medium! leading-relaxed!">
                <span className="text-amber-500! font-bold!">Tip:</span>{" "}
                High-quality photos increase booking rates by up to 40%. Upload
                at least 5 photos showing the bed, bathroom, and amenities.
              </p>
            </div>

            {/* Guidelines Card */}
            <div className="bg-blue-50/50! p-5! rounded-3xl! border! border-blue-100/50! flex! space-x-4!">
              <InfoCircleOutlined className="text-lg! text-primary! shrink-0! mt-0.5!" />
              <div>
                <h4 className="font-bold! text-primary! text-sm! mb-1!">
                  Guidelines
                </h4>
                <p className="text-xs! text-primary/70! font-medium! leading-relaxed!">
                  Please ensure the room number is unique and photos highlight
                  the main amenities to improve booking rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Footer Fixed Actions Bar */}
        <div className="mt-8! bg-white! p-4! md:p-6! rounded-3xl! border! border-slate-100! shadow-sm! flex! flex-col! sm:flex-row! justify-end! space-y-3! sm:space-y-0! sm:space-x-4!">
          <Button
            onClick={() => navigate(-1)}
            className="h-11! px-8! rounded-xl! font-bold! border-slate-200! text-on-surface-variant! hover:bg-slate-50! transition-all!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="h-11! px-8! rounded-xl! bg-[#0F296D]! hover:bg-[#1a3b8b]! font-bold! border-none! shadow-md! shadow-blue-900/10! transition-all! active:scale-95!"
          >
            Update Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditRoom;
