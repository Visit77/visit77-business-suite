import React, { useState } from "react";
import { Button, Modal, Form, DatePicker, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import { roomBlock } from "../../service/actionSlice";
import _ from "lodash";
import { getOneRoom } from "../../service/roomBoardSlice";
import moment from "moment";

const RoomBlockModal = ({ isBlockModalOpen, setIsBlockModalOpen, id }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);

  // Handle Submit / OK Click
  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        // Format DatePicker values to 'YYYY-MM-DD'
        const formattedData = {
          ...values,
          physical_room: id,
          start_date: values.start_date
            ? values.start_date.format("YYYY-MM-DD")
            : null,
          end_date: values.end_date
            ? values.end_date.format("YYYY-MM-DD")
            : null,
        };

        try {
          // Simulated API Request
          dispatch(
            roomBlock({ id: id, business_id: businessId, data: formattedData }),
          ).then((res) => {
            if (_.endsWith(res.type, "fulfilled")) {
              message.success("Room Block Successful.");
              setLoading(false);
              dispatch(
                getOneRoom({
                  business_id: businessId,
                  date: moment().format("YYYY-MM-DD"),
                  id: id,
                }),
              );
            } else if (_.endsWith(res.type, "rejected")) {
              setLoading(false);
            }
          });

          form.resetFields();
          setIsBlockModalOpen(false);
        } catch (error) {
          message.error("Something went wrong!");
        } finally {
          setLoading(false);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  // Handle Cancel / Close Modal
  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      setIsBlockModalOpen(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Modal
        title="Create Schedule"
        open={isBlockModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        okText="Save"
        cancelText="Cancel"
        className=" font-semibold!"
      >
        <Form form={form} layout="vertical" name="schedule_form">
          {/* Start Date */}
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[
              {
                required: true,
                message: "Please select a start date!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select start date"
              disabled={loading}
            />
          </Form.Item>

          {/* End Date */}
          <Form.Item
            name="end_date"
            label="End Date"
            dependencies={["start_date"]}
            rules={[
              {
                required: true,
                message: "Please select an end date!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    !getFieldValue("start_date") ||
                    value.isAfter(getFieldValue("start_date")) ||
                    value.isSame(getFieldValue("start_date"), "day")
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End Date cannot be earlier than Start Date!"),
                  );
                },
              }),
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select end date"
              disabled={loading}
            />
          </Form.Item>

          {/* Note */}
          <Form.Item
            name="note"
            label="Note"
            rules={[
              {
                required: false, // Set to true if you want this field to be required
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter your notes here..."
              disabled={loading}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomBlockModal;
