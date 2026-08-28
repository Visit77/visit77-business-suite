import React, { useEffect, useState } from "react";
import { Steps, Form, Button, message, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import _ from "lodash";

import { selectBusinessId } from "../service/businessSlice";
import { getRoomStandard } from "../service/roomStandardSlice";
import { getRoomBuildTypes } from "../service/roomBuildTypesSlice";
import { getRoomView } from "../service/roomViewSlice";
import { getBedTypes } from "../service/bedTypeSlice";
import { getBathTypes } from "../service/bathTypeSlice";
import { getRoomAmenity } from "../service/roomAmenitySlice";
import { getRoomPolicies } from "../service/roomPoliciesSlice";
import {
  getOneRoomType,
  roomTypeSelector,
  updateRoomType,
  uploadRoomTypeImage,
} from "../service/roomTypeSlice";

import RoomStep1Form from "../components/room/RoomStep1Form";
import RoomStep2Form from "../components/room/RoomStep2Form";
import RoomStep3Form from "../components/room/RoomStep3Form";
import { API_URL } from "../variables/constants";

const EditRoomType = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const businessId = useSelector(selectBusinessId);
  const { details: roomTypeData, isPending: isLoadingRoomType } =
    useSelector(roomTypeSelector);

  // 1. Initial Master Data Fetching
  useEffect(() => {
    dispatch(getRoomStandard({ is_active: true }));
    dispatch(getRoomBuildTypes({ is_active: true }));
    dispatch(getRoomView({ is_active: true }));
    dispatch(getBedTypes({ is_active: true }));
    dispatch(getBathTypes({ is_active: true }));
    dispatch(getRoomAmenity({ is_active: true }));
    dispatch(getRoomPolicies({ is_active: true }));

    if (id) {
      dispatch(getOneRoomType(id));
    }
  }, [dispatch, id]);

  // 2. Pre-fill Form with JSON Data Structure
  useEffect(() => {
    if (roomTypeData) {
      // Map Arrays to ID lists
      const selectedAmenities =
        roomTypeData?.amenities?.map((a) => a.room_amenity?.id || a.id) || [];
      const selectedPolicies =
        roomTypeData?.policies?.map((p) => p.room_policy?.id || p.id) || [];
      const selectedBeds = roomTypeData?.beds?.map((b) => b.bed_type?.id) || [];
      const selectedViews =
        roomTypeData?.view_options?.map((v) => v.room_view?.id) || [];
      const selectedBaths =
        roomTypeData?.bath_options?.map((b) => b.bath_type?.id) || [];

      // Determine Meal Plan Setup based on breakfast_plan_type
      let breakfastPlanType =
        roomTypeData?.breakfast_plan_type || "no_breakfast";
      let breakfastPricingType = "hotel_default_price";
      if (
        breakfastPlanType === "hotel_default_price" ||
        breakfastPlanType === "custom_price"
      ) {
        breakfastPricingType = breakfastPlanType;
        breakfastPlanType = "breakfast_price";
      }
      // Pre-fill fields exactly matching JSON response keys
      form.setFieldsValue({
        // Step 1: Basic Info
        name: roomTypeData?.name || "",
        room_standard_id:
          roomTypeData?.room_standard?.id ||
          roomTypeData?.room_standard_id ||
          null,
        room_build_type_id:
          roomTypeData?.room_build_type?.id ||
          roomTypeData?.room_build_type_id ||
          null,
        description: roomTypeData?.description || "",
        max_adults: String(roomTypeData?.max_adults ?? "2"),
        max_children: String(roomTypeData?.max_children ?? "0"),
        room_area_from: roomTypeData?.room_area_from || "",
        room_area_to: roomTypeData?.room_area_to || "",
        area_unit: roomTypeData?.area_unit || "sqft",

        // Step 2: Options
        beds: selectedBeds,
        view_options: selectedViews,
        bath_options: selectedBaths,

        amenity_ids: selectedAmenities,
        policy_ids: selectedPolicies,

        // Step 3: Prices (Matched with JSON keys)
        local_base_price: roomTypeData?.local_base_price || 0,
        local_usd_display_price: roomTypeData?.local_usd_display_price || 0,
        foreign_base_price: roomTypeData?.foreign_base_price || 0,
        foreign_usd_display_price: roomTypeData?.foreign_usd_display_price || 0,

        // Extra Bed Setup
        extra_bed_available: roomTypeData?.extra_bed_available || false,
        extra_bed_quantity: String(roomTypeData?.extra_bed_quantity ?? "1"),
        extra_bed_local_base_price:
          roomTypeData?.extra_bed_local_base_price || 0,
        extra_bed_local_usd_display_price:
          roomTypeData?.extra_bed_local_usd_display_price || 0,
        extra_bed_foreign_base_price:
          roomTypeData?.extra_bed_foreign_base_price || 0,
        extra_bed_foreign_usd_display_price:
          roomTypeData?.extra_bed_foreign_usd_display_price || 0,

        // Meal Plan Setup
        breakfast_plan_type: breakfastPlanType,

        breakfast_pricing_type: breakfastPricingType,

        breakfast_custom_local_base_price:
          roomTypeData?.breakfast_custom_local_base_price || 0,
        breakfast_custom_local_usd_display_price:
          roomTypeData?.breakfast_custom_local_usd_display_price || 0,
        breakfast_custom_foreign_base_price:
          roomTypeData?.breakfast_custom_foreign_base_price || 0,
        breakfast_custom_foreign_usd_display_price:
          roomTypeData?.breakfast_custom_foreign_usd_display_price || 0,
      });

      // Existing Photos Pre-load into Upload Component
      if (roomTypeData?.photos?.length) {
        const formattedImages = roomTypeData.photos.map((img, idx) => ({
          uid: String(img.id || idx),
          name: `Photo-${img.id || idx + 1}`,
          status: "done",
          url: img.image?.startsWith("http")
            ? img.image
            : `${API_URL || ""}${img.image}`,
        }));
        setFileList(formattedImages);
      }
    }
  }, [roomTypeData, form]);

  const stepItems = [
    { title: "Basic Information" },
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

      const beds = formData?.beds?.map((bed) => ({
        bed_type_id: bed,
        quantity: 1,
        is_guest_selectable: true,
        rank: 1,
      }));

      const baths = formData?.bath_options?.map((bath) => ({
        bath_type_id: bath,
        is_guest_selectable: true,
        rank: 1,
      }));

      const views = formData?.view_options?.map((view) => ({
        room_view_id: view,
        is_guest_selectable: true,
        rank: 1,
      }));

      const finalPayload = {
        ...formData,
        ...values,
        id: id,
        bath_options: baths,
        view_options: views,
        beds: beds,
        is_active: true,
        rank: 1,
        business_id: businessId,
        base_occupancy: 2,
        max_occupancy:
          Number(formData?.max_adults || values?.max_adults || 0) +
          Number(formData?.max_children || values?.max_children || 0),
        allow_guest_bed_preference: true,
        allow_guest_view_preference: true,
        allow_guest_bath_preference: true,
        allow_guest_smoking_preference: true,
        supports_smoking: true,
        supports_non_smoking: true,
        breakfast_plan_type:
          values?.breakfast_plan_type === "breakfast_price"
            ? values?.breakfast_pricing_type
            : values?.breakfast_plan_type,
      };

      dispatch(updateRoomType({ id, data: finalPayload })).then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          message.success("Room Type updated successfully.");

          const newFiles = fileList.filter((file) => file.originFileObj);
          if (newFiles.length > 0) {
            const submitData = new FormData();
            newFiles.forEach((img) => {
              submitData.append("images", img.originFileObj);
            });

            dispatch(
              uploadRoomTypeImage({
                id: id,
                formData: submitData,
              }),
            ).then((imgRes) => {
              if (_.endsWith(imgRes.type, "fulfilled")) {
                message.success("Room Type Images updated.");
                navigate(-1);
              }
            });
          } else {
            navigate(-1);
          }
        }
      });
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  if (isLoadingRoomType) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-50 min-h-screen p-4 font-sans text-slate-800 space-y-4">
      <h1 className="text-center text-lg font-bold text-slate-900 mb-2">
        Edit Room Type
      </h1>

      <div className="py-2 px-1">
        <Steps
          current={currentStep}
          size="small"
          items={stepItems}
          className="font-medium!"
        />
      </div>

      <Form form={form} layout="vertical" className="space-y-4">
        {currentStep === 0 && (
          <RoomStep1Form
            fileList={fileList}
            setFileList={setFileList}
            isEdit={true}
          />
        )}

        {currentStep === 1 && <RoomStep2Form form={form} />}

        {currentStep === 2 && (
          <RoomStep3Form form={form} businessId={businessId} />
        )}

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
              Update
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default EditRoomType;
