import React, { useEffect, useState, useMemo } from "react";
import { Form, Checkbox, Button, Modal, Input } from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { bathTypesSelector } from "../../service/bathTypeSlice";
import { bedTypesSelector } from "../../service/bedTypeSlice";
import { roomViewSelector } from "../../service/roomViewSlice";
import { roomAmenitySelector } from "../../service/roomAmenitySlice";
import { roomPoliciesSelector } from "../../service/roomPoliciesSlice";

const RoomStep2Form = ({ form }) => {
  // Form Values Watchers
  const selectedAmenity_ids = Form.useWatch("amenity_ids", form) || [];
  const selectedPolicy_ids = Form.useWatch("policy_ids", form) || [];

  // Collapsible / See More States
  const [showAllBeds, setShowAllBeds] = useState(false);
  const [showAllViews, setShowAllViews] = useState(false);
  const [showAllBaths, setShowAllBaths] = useState(false);

  // Modal States
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [tempAmenities, setTempAmenities] = useState([]);
  const [amenitiesSearch, setAmenitiesSearch] = useState("");

  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);
  const [tempPolicies, setTempPolicies] = useState([]);
  const [policiesSearch, setPoliciesSearch] = useState("");

  // Redux Selectors
  const { data: bathTypes } = useSelector(bathTypesSelector);
  const { data: bedTypes } = useSelector(bedTypesSelector);
  const { data: roomViews } = useSelector(roomViewSelector);
  const { data: roomAmenity } = useSelector(roomAmenitySelector);
  const { data: roomPolicies } = useSelector(roomPoliciesSelector);

  // Options Handlers (Memoized)
  const bathTypesOption = useMemo(
    () =>
      bathTypes?.map((bath) => ({ label: bath?.name, value: bath?.id })) || [],
    [bathTypes],
  );

  const bedTypesOption = useMemo(
    () => bedTypes?.map((bed) => ({ label: bed?.name, value: bed?.id })) || [],
    [bedTypes],
  );

  const roomViewsOption = useMemo(
    () =>
      roomViews?.map((view) => ({ label: view?.name, value: view?.id })) || [],
    [roomViews],
  );

  const roomAmenityOption = useMemo(
    () =>
      roomAmenity?.map((amenity) => ({
        label: amenity?.name,
        value: amenity?.id,
      })) || [],
    [roomAmenity],
  );

  const roomPoliciesOption = useMemo(
    () =>
      roomPolicies?.map((policy) => ({
        label: policy?.name,
        value: policy?.id,
      })) || [],
    [roomPolicies],
  );

  // Amenities Modal Handlers
  const handleOpenAmenitiesModal = () => {
    setTempAmenities(selectedAmenity_ids);
    setAmenitiesSearch("");
    setIsAmenitiesModalOpen(true);
  };

  const handleSaveAmenities = () => {
    form?.setFieldsValue({ amenity_ids: tempAmenities });
    setIsAmenitiesModalOpen(false);
  };

  const handleRemoveAmenity = (val) => {
    const updated = selectedAmenity_ids.filter((item) => item !== val);
    form?.setFieldsValue({ amenity_ids: updated });
  };

  // Policies Modal Handlers
  const handleOpenPoliciesModal = () => {
    setTempPolicies(selectedPolicy_ids);
    setPoliciesSearch("");
    setIsPoliciesModalOpen(true);
  };

  const handleSavePolicies = () => {
    form?.setFieldsValue({ policy_ids: tempPolicies });
    setIsPoliciesModalOpen(false);
  };

  const handleRemovePolicy = (val) => {
    const updated = selectedPolicy_ids.filter((item) => item !== val);
    form?.setFieldsValue({ policy_ids: updated });
  };

  // Filtered Lists for Search in Modal
  const filteredAmenities = useMemo(
    () =>
      roomAmenityOption.filter((item) =>
        item.label?.toLowerCase().includes(amenitiesSearch.toLowerCase()),
      ),
    [roomAmenityOption, amenitiesSearch],
  );

  const filteredPolicies = useMemo(
    () =>
      roomPoliciesOption.filter((item) =>
        item.label?.toLowerCase().includes(policiesSearch.toLowerCase()),
      ),
    [roomPoliciesOption, policiesSearch],
  );

  return (
    <div className="space-y-4">
      {/* 1. ROOM OPTIONS CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          ROOM OPTIONS
        </h2>

        {/* Bed Types */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800">Bed Types</span>
          <Form.Item name="beds" className="mb-0! mt-3!">
            <Checkbox.Group className="w-full flex flex-col space-y-2">
              {(showAllBeds ? bedTypesOption : bedTypesOption.slice(0, 3)).map(
                (bed) => (
                  <Checkbox
                    key={bed.value}
                    value={bed.value}
                    className="text-xs text-slate-700 mb-1!"
                  >
                    {bed.label}
                  </Checkbox>
                ),
              )}
            </Checkbox.Group>
          </Form.Item>
          {bedTypesOption.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllBeds(!showAllBeds)}
              className="text-xs font-semibold text-blue-600 hover:underline pt-1 block cursor-pointer"
            >
              {showAllBeds ? "See Less" : "See More..."}
            </button>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Views */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800">Views</span>
          <Form.Item name="view_options" className="mb-0! mt-3!">
            <Checkbox.Group className="w-full flex flex-col space-y-2">
              {(showAllViews
                ? roomViewsOption
                : roomViewsOption.slice(0, 3)
              ).map((view) => (
                <Checkbox
                  key={view.value}
                  value={view.value}
                  className="text-xs text-slate-700 mb-1!"
                >
                  {view.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          {roomViewsOption.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllViews(!showAllViews)}
              className="text-xs font-semibold text-blue-600 hover:underline pt-1 block cursor-pointer"
            >
              {showAllViews ? "See Less" : "See More..."}
            </button>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Bath Types */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800">Bath Types</span>
          <Form.Item name="bath_options" className="mb-0! mt-3!">
            <Checkbox.Group className="w-full flex flex-col space-y-2">
              {(showAllBaths
                ? bathTypesOption
                : bathTypesOption.slice(0, 3)
              ).map((bath) => (
                <Checkbox
                  key={bath.value}
                  value={bath.value}
                  className="text-xs text-slate-700 mb-1!"
                >
                  {bath.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          {bathTypesOption.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllBaths(!showAllBaths)}
              className="text-xs font-semibold text-blue-600 hover:underline pt-1 block cursor-pointer"
            >
              {showAllBaths ? "See Less" : "See More..."}
            </button>
          )}
        </div>
      </div>

      {/* 2. AMENITIES CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          AMENITIES
        </h2>

        {/* Hidden Form Item to maintain form registration */}
        <Form.Item name="amenity_ids" hidden>
          <Input />
        </Form.Item>

        <Button
          type="primary"
          onClick={handleOpenAmenitiesModal}
          icon={<PlusOutlined />}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1"
        >
          Add Amenities
        </Button>

        {/* Selected Amenities Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedAmenity_ids.map((val) => {
            const item = roomAmenityOption.find((a) => a.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
              >
                <span>{item?.label || val}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(val)}
                  className="text-red-400 hover:text-red-600 ml-1 flex items-center cursor-pointer"
                >
                  <CloseCircleOutlined className="text-sm" />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. ROOM POLICIES CARD */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          ROOM POLICIES
        </h2>

        {/* Hidden Form Item to maintain form registration */}
        <Form.Item name="policy_ids" hidden>
          <Input />
        </Form.Item>

        <Button
          type="primary"
          onClick={handleOpenPoliciesModal}
          icon={<PlusOutlined />}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1"
        >
          Add Room Policies
        </Button>

        {/* Selected Policies Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedPolicy_ids.map((val) => {
            const item = roomPoliciesOption.find((p) => p.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
              >
                <span>{item?.label || val}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePolicy(val)}
                  className="text-red-400 hover:text-red-600 ml-1 flex items-center cursor-pointer"
                >
                  <CloseCircleOutlined className="text-sm" />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* AMENITIES MODAL */}
      <Modal
        open={isAmenitiesModalOpen}
        onCancel={() => setIsAmenitiesModalOpen(false)}
        footer={null}
        closable={false}
        centered
        width={400}
        className="rounded-3xl overflow-hidden p-0"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-base text-slate-800 mx-auto">
              Select Amenities
            </span>
            <button
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 absolute right-4 cursor-pointer"
            >
              <CloseOutlined className="text-base" />
            </button>
          </div>

          <Input
            prefix={<SearchOutlined className="text-slate-400 mr-1" />}
            placeholder="Search Amenities"
            value={amenitiesSearch}
            onChange={(e) => setAmenitiesSearch(e.target.value)}
            className="rounded-xl h-10 bg-slate-50 border-slate-200 text-xs"
          />

          <div className="max-h-60 overflow-y-auto space-y-3 px-1">
            <Checkbox.Group
              value={tempAmenities}
              onChange={(checked) => setTempAmenities(checked)}
              className="w-full flex flex-col space-y-3"
            >
              {filteredAmenities.map((item) => (
                <Checkbox
                  key={item.value}
                  value={item.value}
                  className="text-xs font-medium text-slate-700"
                >
                  {item.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveAmenities}
              className="h-10 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* ROOM POLICIES MODAL */}
      <Modal
        open={isPoliciesModalOpen}
        onCancel={() => setIsPoliciesModalOpen(false)}
        footer={null}
        closable={false}
        centered
        width={400}
        className="rounded-3xl overflow-hidden p-0"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-base text-slate-800 mx-auto">
              Select Room Policies
            </span>
            <button
              onClick={() => setIsPoliciesModalOpen(false)}
              className="text-slate-400 hover:text-slate-600 absolute right-4 cursor-pointer"
            >
              <CloseOutlined className="text-base" />
            </button>
          </div>

          <Input
            prefix={<SearchOutlined className="text-slate-400 mr-1" />}
            placeholder="Search Policies"
            value={policiesSearch}
            onChange={(e) => setPoliciesSearch(e.target.value)}
            className="rounded-xl h-10 bg-slate-50 border-slate-200 text-xs"
          />

          <div className="max-h-60 overflow-y-auto space-y-3 px-1">
            <Checkbox.Group
              value={tempPolicies}
              onChange={(checked) => setTempPolicies(checked)}
              className="w-full flex flex-col space-y-3"
            >
              {filteredPolicies.map((item) => (
                <Checkbox
                  key={item.value}
                  value={item.value}
                  className="text-xs font-medium text-slate-700"
                >
                  {item.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => setIsAmenitiesModalOpen(false)}
              className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border-none"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSavePolicies}
              className="h-10 bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomStep2Form;
