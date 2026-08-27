import React, { useEffect, useState } from "react";
import { Steps, Form, Button, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { selectBusinessId } from "../service/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import { getRoomStandard } from "../service/roomStandardSlice";
import { getRoomBuildTypes } from "../service/roomBuildTypesSlice";
import RoomStep1Form from "../components/room/RoomStep1Form";
import RoomStep2Form from "../components/room/RoomStep2Form";
import RoomStep3Form from "../components/room/RoomStep3Form";
import { getRoomView } from "../service/roomViewSlice";
import { getBedTypes } from "../service/bedTypeSlice";
import { getBathTypes } from "../service/bathTypeSlice";
import { getRoomAmenity } from "../service/roomAmenitySlice";
import { getRoomPolicies } from "../service/roomPoliciesSlice";
import { createRoomType, uploadRoomTypeImage } from "../service/roomTypeSlice";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const CreateRoomType = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRoomStandard({ is_active: true }));
    dispatch(getRoomBuildTypes({ is_active: true }));
    dispatch(getRoomView({ is_active: true }));
    dispatch(getBedTypes({ is_active: true }));
    dispatch(getBathTypes({ is_active: true }));
    dispatch(getRoomAmenity({ is_active: true }));
    dispatch(getRoomPolicies({ is_active: true }));
  }, [dispatch]);

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

      const beds = values?.beds?.map((bed) => {
        return {
          bed_type_id: bed,
          quantity: 1,
          is_guest_selectable: true,
          rank: 1,
        };
      });

      const baths = values?.bath_options?.map((bath) => {
        return {
          bath_type_id: bath,
          is_guest_selectable: true,
          rank: 1,
        };
      });

      const views = values?.view_options?.map((view) => {
        return {
          room_view_id: view,
          is_guest_selectable: true,
          rank: 1,
        };
      });

      const finalPayload = {
        ...formData,
        ...values,
        bath_options: baths,
        view_options: views,

        is_active: true,
        rank: 1,
        business_id: businessId,
        beds,
        base_occupancy: 2,
        max_occupancy: formData?.max_adults + formData?.max_children,
        allow_guest_bed_preference: true,
        allow_guest_view_preference: true,
        allow_guest_bath_preference: true,
        allow_guest_smoking_preference: true,
        supports_smoking: true,
        supports_non_smoking: true,
        breakfast_plan_type:
          values?.breakfast_plan_type == "breakfast_price"
            ? values?.breakfast_pricing_type
            : values?.breakfast_plan_type,
      };

      dispatch(createRoomType({ data: finalPayload })).then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          message.success("Room Type Create Successful.");
          const { payload } = res;

          const submitData = new FormData();

          fileList?.forEach((img, index) => {
            if (img) {
              submitData.append(`images`, img?.originFileObj);
            }
          });
          dispatch(
            uploadRoomTypeImage({
              id: payload?.data?.id,
              formData: submitData,
            }),
          ).then((res) => {
            if (_.endsWith(res.type, "fulfilled")) {
              message.success("Room Type Image Successful.");
              navigate(-1);
            }
          });
        }
      });

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
          name: "",
          room_standard_id: null,
          room_build_type_id: null,
          description: "",
          max_adults: "2",
          max_children: "0",
          room_area_from: "",
          room_area_to: "",
          area_unit: null,
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
        {currentStep === 2 && (
          <RoomStep3Form form={form} businessId={businessId} />
        )}

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
