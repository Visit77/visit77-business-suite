import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { updateRoomStatus } from "../../service/actionSlice";
import { selectBusinessId } from "../../service/businessSlice";
import { getOneRoom } from "../../service/roomBoardSlice";
import moment from "moment";

const OutOfServiceModal = ({ isModalOpen, setIsModalOpen, id }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);

  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          dispatch(
            updateRoomStatus({
              id: id,
              business_id: businessId,
              data: { ...values, status: "out_of_service" },
            }),
          ).then((res) => {
            if (_.endsWith(res.type, "fulfilled")) {
              message.success("Success");
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
          setIsModalOpen(false);
        } catch (error) {
          // message.error("တစ်ခုခု မှားယွင်းနေပါသည်။");
        } finally {
          setLoading(false);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Modal
        // title="Block"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <Form form={form} layout="vertical" name="description_form">
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please write description",
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Please write description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OutOfServiceModal;
