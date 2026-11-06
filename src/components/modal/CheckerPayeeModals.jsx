import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import {
  createHotelChecker,
  getHotelChecker,
  hotelCheckerSelector,
  removeHotelChecker,
} from "../../service/hotelCheckerSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../../service/businessSlice";
import _ from "lodash";
import { confirmReceive } from "../../service/otaRevenueSlice";
import SelectCheckerModal from "./CheckerPayeeModal/SelectCheckerModal";
import PasscodeModal from "./CheckerPayeeModal/PasscodeModal";
import AddCheckerModal from "./CheckerPayeeModal/AddCheckerModal";

const CheckerPayeeModals = ({
  isSelectCheckerOpen,
  setIsSelectCheckerOpen,
  remittance,
}) => {
  const [isAddCheckerOpen, setIsAddCheckerOpen] = useState(false);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [selectedChecker, setSelectedChecker] = useState(null);
  const [passcode, setPasscode] = useState(["", "", "", ""]);

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { data, isPending } = useSelector(hotelCheckerSelector);

  const [form] = Form.useForm();

  useEffect(() => {
    if (businessId && isSelectCheckerOpen === true) {
      dispatch(getHotelChecker({ business_id: businessId }));
    }
  }, [dispatch, businessId, isSelectCheckerOpen]);

  const handleAddChecker = (values) => {
    dispatch(
      createHotelChecker({ business_id: businessId, data: values }),
    ).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });
    setIsAddCheckerOpen(false);
    form.resetFields();
  };

  const handleRemoveChecker = (id) => {
    dispatch(removeHotelChecker({ id: id, business_id: businessId })).then(
      (response) => {
        if (_.endsWith(response.type, "fulfilled")) {
          message.success("Success");
        } else {
          message.error("Error");
        }
      },
    );
  };

  const handleSelectCheckerItem = (checker) => {
    setSelectedChecker(checker);
    setIsSelectCheckerOpen(false);
    setIsPasscodeOpen(true);
    setPasscode(["", "", "", ""]);
  };

  const handlePasscodeChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newPasscode = [...passcode];
      newPasscode[index] = value;
      setPasscode(newPasscode);

      if (value && index < 3) {
        const nextInput = document.getElementById(
          `passcode-input-${index + 1}`,
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleConfirmPasscode = () => {
    const enteredPasscode = passcode.join("");
    if (enteredPasscode.length !== 4) {
      message.error("Please enter a 4-digit passcode");
      return;
    }

    dispatch(
      confirmReceive({
        business_id: businessId,
        id: remittance?.id,
        data: { actor_id: selectedChecker?.id, passcode: enteredPasscode },
      }),
    ).then((response) => {
      if (_.endsWith(response.type, "fulfilled")) {
        message.success("Success");
      } else {
        message.error("Error");
      }
    });

    setIsPasscodeOpen(false);
  };

  return (
    <div>
      <SelectCheckerModal
        open={isSelectCheckerOpen}
        onCancel={() => setIsSelectCheckerOpen(false)}
        isPending={isPending}
        data={data}
        onSelectChecker={handleSelectCheckerItem}
        onRemoveChecker={handleRemoveChecker}
        onOpenAddChecker={() => {
          setIsSelectCheckerOpen(false);
          setIsAddCheckerOpen(true);
        }}
      />

      <PasscodeModal
        open={isPasscodeOpen}
        onCancel={() => setIsPasscodeOpen(false)}
        passcode={passcode}
        onPasscodeChange={handlePasscodeChange}
        onConfirm={handleConfirmPasscode}
      />

      <AddCheckerModal
        open={isAddCheckerOpen}
        onCancel={() => setIsAddCheckerOpen(false)}
        form={form}
        onFinish={handleAddChecker}
      />
    </div>
  );
};

export default CheckerPayeeModals;
