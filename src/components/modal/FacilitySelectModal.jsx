import React, { useEffect, useState } from "react";
import { Modal, Form, Checkbox, Spin, Button, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getFacility, facilitySelector } from "../../service/facilitySlice";

const FacilitySelectModal = ({
  open,
  onClose,
  onSubmit,
  initialSelected = [],
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const {
    data: facilities,
    isPending,
    hasError,
  } = useSelector(facilitySelector);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(getFacility({ limit: 100 }));
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        facility_ids: initialSelected,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialSelected, form]);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(values.facility_ids);
      }
      onClose();
    } catch (err) {
      console.error("Failed to submit selected facilities:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div className="text-lg font-bold text-slate-800">
          Select Hotel Facilities
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2"
      >
        <Form.Item
          name="facility_ids"
          label={
            <span className="font-medium text-slate-600">
              Choose Facilities
            </span>
          }
        >
          {isPending ? (
            <div className="flex justify-center items-center py-12">
              <Spin tip="Loading facilities..." />
            </div>
          ) : hasError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load facilities. Please try again.
            </div>
          ) : !facilities || facilities.length === 0 ? (
            <Empty description="No facilities found" className="py-8" />
          ) : (
            <Checkbox.Group className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-h-80 overflow-y-auto p-1">
                {facilities.map((facility) => (
                  <label
                    key={facility.id}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:border-primary/50 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-100/50"
                  >
                    <Checkbox value={facility.id} />
                    <div className="flex flex-col ml-2">
                      <span className="font-semibold text-sm text-slate-800">
                        {facility.name || facility.title || "Facility"}
                      </span>
                      {facility.description && (
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {facility.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Checkbox.Group>
          )}
        </Form.Item>

        <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
          <Button
            onClick={onClose}
            className="rounded-xl px-5 h-10 font-medium"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={isPending}
            className="bg-primary hover:bg-primary-container rounded-xl px-6 h-10 font-medium"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FacilitySelectModal;
