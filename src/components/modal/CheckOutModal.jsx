import React, { useState } from "react";
import { Button, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import { checkOutRoom } from "../../service/actionSlice";
import { getOneRoom } from "../../service/roomBoardSlice";
import _ from "lodash";
import moment from "moment";

const CheckOutModal = ({
  isCheckOutModalOpen,
  setIsCheckOutModalOpen,
  data,
}) => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    try {
      dispatch(
        checkOutRoom({
          booking_id: data?.current_booking?.id,
          business_id: businessId,
        }),
      ).then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          message.success("Success");
          setLoading(false);
          dispatch(
            getOneRoom({
              business_id: businessId,
              date: moment().format("YYYY-MM-DD"),
              id: data?.id,
            }),
          );
        } else if (_.endsWith(res.type, "rejected")) {
          setLoading(false);
        }
      });

      setIsCheckOutModalOpen(false);
    } catch (error) {
      //   message.error("တစ်ခုခု မှားယွင်းနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsCheckOutModalOpen(false);
  };
  return (
    <>
      <Modal
        title=""
        closable={{ "aria-label": "Custom Close Button" }}
        open={isCheckOutModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <div className=" font-bold! text-lg ">
          Are you sure to check out{" "}
          <span className=" text-primary-500">#{data?.room_number}</span>.
        </div>
      </Modal>
    </>
  );
};
export default CheckOutModal;
