import React, { useEffect, useRef, useState } from "react";
import { Button, Input, message, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { requestOtp, verifyRequestOtp } from "../service/authSlice";
import { updateProfile, userSelector } from "../service/userSlice";
import { UNIQUE_DEVICE_ID, UNIQUE_DEVICE_MODEL } from "../variables/constants";
import { SafetyCertificateOutlined } from "@ant-design/icons";

const OtpVerification = () => {
  const location = useLocation();
  const { values } = location?.state || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(150);
  const [showResend, setShowResend] = useState(false);
  const [accountId, setAccountId] = useState();
  const intervalRef = useRef(null);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const { profile } = useSelector(userSelector);

  useEffect(() => {
    if (values) {
      setAccountId(values?.account_id);
    }
  }, [values]);
  const handleOtpChange = (e) => {
    setOtp(e);
  };

  const startCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    setCountdown(150);
    setShowResend(false);
    startCountdown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleResendOtp = () => {
    setLoading(true);
    dispatch(requestOtp(values)).then((res) => {
      if (_.endsWith(res.type, "fulfilled")) {
        message.success("Request OTP successfully!");
        setLoading(false);
        setCountdown(150);
        setShowResend(false);
        startCountdown();
      } else if (_.endsWith(res.type, "rejected")) {
        setLoading(false);
      }
    });
  };

  let device_id = localStorage.getItem(UNIQUE_DEVICE_ID);
  let device_model = localStorage.getItem(UNIQUE_DEVICE_MODEL);

  const handleVerifyOtp = () => {
    setLoading(true);
    if (otp?.length === 6) {
      dispatch(
        verifyRequestOtp({
          ...values,
          account_id: accountId,
          otp,
          device_id,
          device_model,
          is_grace_window_verify: true,
        }),
      )
        .then((res) => {
          if (_.endsWith(res.type, "fulfilled")) {
            message.success("OTP verify successfully!");
            nav("/");
          }
        })
        .catch(() => {
          console.error("error");
        })
        .finally(() => {
          setLoading(false);
          setOtp("");
        });
    } else {
      notification.error({
        message: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen w-full p-4 flex justify-center items-center ">
      <div className="w-full! max-w-md! bg-white! p-6! md:p-8! rounded-3xl! border! border-slate-100! shadow-lg! shadow-slate-100/50! space-y-6! md:space-y-8! relative!">
        <div className="w-full  flex! items-center! justify-center! mb-4! ">
          <SafetyCertificateOutlined className="text-6xl! text-[#0F296D]!" />
        </div>
        <div className="text-neutral-700 font-bold text-center my-5">
          Security Verification
        </div>
        <p className="text-center text-neutral-600 leading-7">
          We have sent a 6-digit one-time password (OTP) to your registered
          security channel.
        </p>
        <p className="text-center text-primary-500 font-semibold text-lg mb-5">
          {values?.phone ? values?.phone : values?.email}
        </p>
        <div className="w-full flex justify-center items-center">
          <Input.OTP
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            maxLength={6}
            // className="mt-3 border-2 border-gray-300 p-2 rounded-md w-full text-center"
          />
        </div>

        {/* <div className="flex justify-between items-center mt-5">
          <button
            className="w-full! bg-primary! hover:bg-primary-container! text-on-primary! font-semibold! text-base! h-12! rounded-xl! border-none! flex! items-center! justify-center! space-x-2! transition-all! group!"
            disabled={loading}
            onClick={handleVerifyOtp}
          >
            Confirm
          </button>
        </div> */}
        <div className="space-y-3! pt-2!">
          <Button
            type="primary"
            onClick={handleVerifyOtp}
            loading={loading}
            className="w-full! h-12! bg-[#0F296D]! hover:bg-[#1a3b8b]! font-bold! text-sm! rounded-xl! border-none! shadow-md! shadow-blue-900/10! transition-all!"
          >
            Verify and Proceed
          </Button>
          <Button
            onClick={() => nav(-1)}
            className="w-full! h-12! rounded-xl! font-bold! text-sm! border-slate-200! text-slate-500! hover:bg-slate-50! transition-all!"
          >
            Cancel
          </Button>
        </div>
        <p className="text-center text-md mt-4 font-semibold">
          {showResend ? (
            <span className="text-red-500">Time Over</span>
          ) : (
            <>
              <span className="text-success-600">
                {`${Math.floor(countdown / 60)}:${(countdown % 60)
                  .toString()
                  .padStart(2, "0")}`}
                &nbsp;
              </span>
              <span>time left</span>
            </>
          )}
        </p>

        {showResend && (
          <div className="text-center text-neutral-600 text-md mt-4 font-semibold">
            Don't receive code?&nbsp;
            <button
              type="button"
              className="text-md font-semibold text-primary-600"
              onClick={handleResendOtp}
            >
              Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
