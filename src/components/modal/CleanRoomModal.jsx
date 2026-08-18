import React, { useState } from "react";
import { Button, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import { checkOutRoom, updateRoomStatus } from "../../service/actionSlice";
import { getOneRoom } from "../../service/roomBoardSlice";
import _ from "lodash";
import moment from "moment";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";

const CleanRoomModal = ({ isCleanModalOpen, setIsCleanModalOpen, data }) => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    try {
      dispatch(
        updateRoomStatus({
          id: data?.id,
          business_id: businessId,
          data: { status: "vacant", note: "Available" },
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

      setIsCleanModalOpen(false);
    } catch (error) {
      //   message.error("တစ်ခုခု မှားယွင်းနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsCleanModalOpen(false);
  };
  return (
    <>
      <Modal
        title={
          <div className=" flex">
            <HugeiconsIcon icon={Alert02Icon} className=" text-warning-500!" />
            &nbsp;Clean Room
          </div>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isCleanModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        className=" font-semibold!"
      >
        <div className=" font-semibold text-lg ">
          Do you want to clean the&nbsp;
          <span className=" text-primary-500">#{data?.room_number}</span> room
          ?.
        </div>
      </Modal>
    </>
  );
};
export default CleanRoomModal;
