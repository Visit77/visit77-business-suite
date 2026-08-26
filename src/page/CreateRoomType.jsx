import React, { useEffect, useState } from "react";
import { Steps, Form, Input, Select, Button, Upload, message } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRoomStandard } from "../service/roomStandardSlice";
import RoomStep1Form from "../components/room/RoomStep1Form";
import RoomStep2Form from "../components/room/RoomStep2Form";
import RoomStep3Form from "../components/room/RoomStep3Form";

const { TextArea } = Input;

const CreateRoomType = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoomStandard());
  }, [businessId, dispatch]);

  const stepItems = [
    { title: "Basic Informations" },
    { title: "Guest Set Up" },
    { title: "Pricing" },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalPayload = {
        ...formData,
        ...values,
        images: fileList.map((file) => file.originFileObj || file),
      };

      console.log("Final Submitted Data:", finalPayload);
      message.success("Room Type created successfully!");
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-50 min-h-screen p-4 font-sans text-slate-800 space-y-4">
      <h1 className="text-center text-lg font-bold text-slate-900 mb-2">
        Create Room Type
      </h1>

      {/* Ant Design Steps */}
      <div className="py-2 px-1">
        <Steps
          current={currentStep}
          size="small"
          items={stepItems}
          className=" font-medium!"
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          room_type_name: "Dulex Room",
          room_standard: "Standard Room",
          room_build_type: "Cottage",
          description: "Description",
          max_adults: "2",
          max_children: "10",
          size_from: "200",
          size_to: "300",
          area_unit: "sqft",
        }}
        className="space-y-4"
      >
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 0 && (
          <RoomStep1Form fileList={fileList} setFileList={setFileList} />
        )}

        {/* STEP 2: GUEST SET UP */}
        {currentStep === 1 && <RoomStep2Form />}

        {/* STEP 3: PRICING */}
        {currentStep === 2 && <RoomStep3Form />}

        {/* NAVIGATION BUTTONS (Previous, Next, Submit) */}
        <div className="flex items-center justify-between pt-4">
          {currentStep > 0 ? (
            <Button
              onClick={handlePrev}
              className="rounded-xl px-5 h-10 font-medium text-xs border-slate-300 text-slate-600"
            >
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < stepItems.length - 1 ? (
            <Button
              type="link"
              onClick={handleNext}
              className="flex items-center space-x-1 text-blue-600 font-bold text-sm hover:text-blue-700"
            >
              <span>Next</span>
              <ArrowRightOutlined />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 h-10 font-semibold text-xs text-white"
            >
              Submit
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CreateRoomType;
