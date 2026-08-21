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

const FinishRepairModal = ({
  isRepairModalOpen,
  setIsRepairModalOpen,
  data,
}) => {
  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    try {
      dispatch(
        updateRoomStatus({
          id: data?.id,
          business_id: businessId,
          data: { status: "cleaning", note: "Finish Repair" },
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

      setIsRepairModalOpen(false);
    } catch (error) {
      //   message.error("တစ်ခုခု မှားယွင်းနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsRepairModalOpen(false);
  };
  return (
    <>
      <Modal
        title={
          <div className=" flex">
            <HugeiconsIcon icon={Alert02Icon} className=" text-warning-500!" />
            &nbsp;Finish Repair Room
          </div>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isRepairModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        className=" font-semibold!"
      >
        <div className=" font-semibold text-lg ">
          Are you sure to take this action for &nbsp;
          <span className=" text-primary-500">#{data?.room_number}</span> room
          ?.
        </div>
      </Modal>
    </>
  );
};
export default FinishRepairModal;
