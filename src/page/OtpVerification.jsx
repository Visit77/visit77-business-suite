import React, { useState } from "react";
import { Button, Input, message } from "antd";
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import { verifyRequestOtp } from "../service/authSlice";
import { updateProfile } from "../service/userSlice";

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { values } = location?.state || {};

  const handleVerify = () => {
    if (otpValue.length < 6) {
      message.error(
        "ကျေးဇူးပြု၍ OTP ကုဒ် ၆ လုံး ပြည့်အောင်ရိုက်နှိပ်ပေးပါရန်။",
      );
      return;
    }

    setLoading(true);
    if (otp?.length === 6) {
      if (values?.change_login == true) {
        dispatch(
          verifyRequestOtp({
            ...values,
            account_id: values?.account_id,
            otp: otpValue,
            is_grace_window_verify: false,
          }),
        )
          .then((res) => {
            message.loading({ content: "Verifying OTP...", key: "otp-verify" });

            if (_.endsWith(res.type, "fulfilled")) {
              message.success("OTP verify successfully!");

              const updateUser = { ...profile, ...values };
              dispatch(
                updateProfile({ id: profile?.id, values: updateUser }),
              ).then((res) => {
                if (_.endsWith(res.type, "fulfilled")) {
                  nav("/dashboard");
                } else if (_.endsWith(res.type, "rejected")) {
                  setLoading(false);
                }
              });
            }
          })
          .catch(() => {
            console.error("error");
          })
          .finally(() => {
            setLoading(false);
            setOtpValue("");
          });
      }
    }
  };

  return (
    <div className="min-h-screen! bg-[#FAFBFD]! flex! items-center! justify-center! p-4! font-sans!">
      {/* Main Container Card */}
      <div className="w-full! max-w-md! bg-white! p-6! md:p-8! rounded-3xl! border! border-slate-100! shadow-lg! shadow-slate-100/50! space-y-6! md:space-y-8! relative!">
        {/* Back Navigation Button */}
        <div className="absolute! top-6! left-6!">
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined className="text-slate-500!" />}
            onClick={() => navigate(-1)}
            className="flex! items-center! justify-center! hover:bg-slate-50!"
          />
        </div>

        {/* Top Graphic Logo Segment */}
        <div className="flex! flex-col! items-center! text-center! pt-6!">
          <div className="w-16! h-16! bg-blue-50! rounded-2xl! flex! items-center! justify-center! mb-4! border! border-blue-100/30!">
            <SafetyCertificateOutlined className="text-2xl! text-[#0F296D]!" />
          </div>
          <h2 className="font-title! text-xl! md:text-2xl! font-bold! text-slate-800! mb-1.5!">
            Security Verification
          </h2>
          <p className="text-xs! md:text-sm! text-slate-400! font-medium! max-w-xs! leading-relaxed!">
            We have sent a 6-digit one-time password (OTP) to your registered
            security channel.
          </p>
        </div>

        {/* Core Content Area */}
        <div className="space-y-5!">
          {/* Main OTP Input Section */}
          <div className="space-y-2! text-center!">
            <span className="text-[11px]! font-bold! text-slate-400! tracking-wider! uppercase! block!">
              Enter 6-Digit OTP Code
            </span>

            <div className="flex! justify-center! [&_.ant-input-otp]:gap-2! sm:[&_.ant-input-otp]:gap-3!">
              <Input.OTP
                length={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                size="large"
                formatter={(str) => str.replace(/\D/g, "")} // နံပါတ်သီးသန့်ပဲ ရိုက်လို့ရစေရန်
                className="[&_input]:h-12! [&_input]:sm:h-14! [&_input]:w-10! [&_input]:sm:w-12! [&_input]:rounded-xl! [&_input]:border-slate-200! [&_input]:text-lg! [&_input]:font-bold! [&_input]:text-slate-800! [&_input]:bg-slate-50/50! [&_input:focus]:border-[#0F296D]! [&_input:focus]:shadow-none!"
              />
            </div>
          </div>

          {/* Guidelines Resend Dynamic Prompt */}
          <div className="text-center! pt-1!">
            <p className="text-xs! text-slate-400! font-medium!">
              Didn't receive the verification code?{" "}
              <button
                type="button"
                className="text-blue-600! font-bold! hover:underline! bg-transparent! border-none! cursor-pointer! p-0!"
                onClick={() =>
                  message.success("ကုဒ်အသစ်ကို ထပ်မံပေးပို့လိုက်ပါပြီ။")
                }
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>

        {/* Footer Trigger CTA Buttons */}
        <div className="space-y-3! pt-2!">
          <Button
            type="primary"
            onClick={handleVerify}
            loading={loading}
            className="w-full! h-12! bg-[#0F296D]! hover:bg-[#1a3b8b]! font-bold! text-sm! rounded-xl! border-none! shadow-md! shadow-blue-900/10! transition-all!"
          >
            Verify and Proceed
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className="w-full! h-12! rounded-xl! font-bold! text-sm! border-slate-200! text-slate-500! hover:bg-slate-50! transition-all!"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
