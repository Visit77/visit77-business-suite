import React, { useEffect } from "react";
import { Form, Select, Checkbox, Button, Carousel, Image, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddRoomNumberInput from "../input/AddRoomNumberInput";
import { API_URL } from "../../variables/constants";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddRoomNumberForm = ({
  initialValues,
  onSubmit,
  isUpdate = false,
  roomType,
}) => {
  const [form] = Form.useForm();

  const isExtraBedAvailable = Form.useWatch("extra_bed_available", form);
  const navigate = useNavigate();
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (!isExtraBedAvailable) {
      form.setFieldValue("extra_bed_quantity", 0);
    }
  }, [isExtraBedAvailable, form]);

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      custom_option_value_ids: [],
      status: "vacant",
      smoking_type: "non_smoking",
    });
  };

  const areaOptions = Array.from(
    {
      length:
        (roomType?.room_area_to || 0) - (roomType?.room_area_from || 0) + 1,
    },
    (_, i) => (roomType?.room_area_from || 0) + i,
  );

  const bedOptions = Array.from(
    { length: (roomType?.extra_bed_quantity || 0) + 1 },
    (_, i) => i,
  );

  const carouselSettings = {
    arrows: true,
    dots: true,
    infinite: roomType?.photos?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 mb-4">
        {roomType?.photos?.length > 0 ? (
          <div className="w-32 h-20 overflow-hidden rounded-xl relative">
            <Image.PreviewGroup>
              <Carousel
                {...carouselSettings}
                className="room-detail-carousel w-full h-full"
              >
                {roomType?.photos?.map((pic, index) => (
                  <div
                    key={index}
                    className="w-full h-20 relative flex items-center justify-center bg-gray-50"
                  >
                    <Image
                      src={`${API_URL}${pic?.image}`}
                      alt={`Room Image ${index + 1}`}
                      className="object-cover! w-full! h-20! rounded-xl!"
                      wrapperClassName="w-full! h-full!"
                      fallback="https://via.placeholder.com/150"
                    />
                  </div>
                ))}
              </Carousel>
            </Image.PreviewGroup>
          </div>
        ) : (
          <div className="flex w-32 h-20 items-center justify-center bg-slate-100 rounded-xl">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No images"
            />
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-800 m-0">{roomType?.name}</h3>
          <p className="text-xs text-gray-400 m-0">{roomType?.description}</p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          groups: [{ building: undefined, floor: undefined, room_numbers: [] }],
          extra_bed_available: false,
          extra_bed_quantity: 0,
          room_view_ids: [],
          bath_type_ids: [],
          amenities: [],
          policies: [],
        }}
      >
        <Form.List name="groups">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <AddRoomNumberInput
                  key={field.key}
                  field={field}
                  remove={remove}
                  form={form}
                />
              ))}
              <Button
                type="text"
                onClick={() => add()}
                icon={<PlusOutlined />}
                className="text-indigo-600 font-semibold p-0 mb-6 hover:bg-transparent"
              >
                Add
              </Button>
            </>
          )}
        </Form.List>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <h4 className="text-teal-500 font-bold text-xs tracking-wider uppercase mb-3">
            BASIC INFO
          </h4>

          <Form.Item
            name="room_view_ids"
            label={<span className="text-gray-700">Room View</span>}
            rules={[{ required: true, message: "Please select room view" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Room Views"
              size="large"
              allowClear
            >
              {roomType?.view_options?.map((view) => (
                <Option
                  key={view?.room_view?.id}
                  value={`${view?.room_view?.id}`}
                >
                  {view?.room_view?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Multi Select for Bath Type */}
          <Form.Item
            name="bath_type_ids"
            label={<span className="text-gray-700">Bath Type</span>}
            rules={[{ required: true, message: "Please select bath type" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Bath Types"
              size="large"
              allowClear
            >
              {roomType?.bath_options?.map((option) => (
                <Option
                  key={option?.bath_type?.id}
                  value={`${option?.bath_type?.id}`}
                >
                  {option?.bath_type?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="room_area" label="Room Area">
              <Select size="large">
                {areaOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="area_unit" label="Area Unit">
              <Select size="large" defaultValue="sqm">
                <Option value="sqm">sqm</Option>
                <Option value="sqft">sqft</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* BED CONFIGURATION */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <h4 className="text-teal-500 font-bold text-xs tracking-wider uppercase mb-3">
            BED CONFIGURATION
          </h4>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <Form.Item
              name="beds"
              label="Bed Type"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select" size="large">
                {roomType?.beds?.map((option) => (
                  <Option
                    key={option?.bed_type?.id}
                    value={option?.bed_type?.id}
                  >
                    {option?.bed_type?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="bed_quantity"
              label="Quantity"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
            </Form.Item>
          </div>

          {roomType?.extra_bed_available && (
            <div className="flex items-center justify-between pt-2">
              <Form.Item
                name="extra_bed_available"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox>
                  <span className="text-sm font-medium">
                    Extra Bed Available
                  </span>
                </Checkbox>
              </Form.Item>
              <Form.Item name="extra_bed_quantity" className="mb-0">
                <Select
                  size="large"
                  className="w-20"
                  disabled={!isExtraBedAvailable}
                >
                  {bedOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          )}
        </div>

        {/* AMENITIES */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-teal-500 font-bold text-xs tracking-wider uppercase m-0">
              AMENITIES
            </h4>
          </div>
          <Form.Item name="amenities" className="mb-0">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Select Amenities"
            >
              {roomType?.amenities?.map((option) => (
                <Option key={option?.id} value={option?.id}>
                  {option?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Actions Footer */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            size="large"
            className="rounded-xl font-semibold bg-gray-200 text-gray-700 border-none"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="rounded-xl font-semibold bg-indigo-600"
          >
            {isUpdate ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddRoomNumberForm;
