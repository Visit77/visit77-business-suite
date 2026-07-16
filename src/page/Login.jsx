import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowRightOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
  LoadingOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  TOKEN_LABEL,
  UNIQUE_DEVICE_ID,
  UNIQUE_DEVICE_MODEL,
} from "../variables/constants";
import { login } from "../service/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [loginMethod, setLoginMethod] = useState("email");

  const onFinish = async (values) => {
    setLoading(false);

    let device_id = localStorage.getItem(UNIQUE_DEVICE_ID);
    let device_model = localStorage.getItem(UNIQUE_DEVICE_MODEL);
    if (!device_id) {
      device_id = crypto.randomUUID();
      localStorage.setItem(UNIQUE_DEVICE_ID, device_id);
    }

    // 2. Await the High Entropy Values
    if (!device_model) {
      if (navigator.userAgentData) {
        try {
          const ua = await navigator.userAgentData.getHighEntropyValues([
            "model",
            "platform",
          ]);
          device_model = ua.brands[2]?.brand || ua.platform;
          localStorage.setItem(UNIQUE_DEVICE_MODEL, device_model);
        } catch (err) {
          console.error("UA Data Error:", err);
        }
      }
    }
    const loginData = {
      device_id,
      device_model,
      password: values.password,
      username:
        loginMethod === "email"
          ? values.email
          : `+95${values.phone?.replace(/\s/g, "").replace(/^0/, "")}`,
    };

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      dispatch(login({ ...loginData }))
        .then((res) => {
          if (res.type.endsWith("fulfilled")) {
            const { payload } = res;

            if (payload?.data?.otp_required == true) {
              navigate("/confirm-otp", {
                state: {
                  values: { ...payload?.data?.otp_data, change_login: false },
                },
              });
            } else {
              message.success("Login is successfully");
              navigate("/dashboard");
            }
          }
        })
        .finally(() => {
          // setIsSubmit(false);
        });
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex items-center justify-center overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-[#e5eeff] opacity-70" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Branding Header */}
          {/* <div className="text-center mb-6">
            <h1 className="font-title text-4xl font-bold text-primary mb-1 tracking-tight">
              LuxeManage
            </h1>
            <p className="text-sm font-medium text-on-surface-variant/70">
              Hospitality Group Administrative Portal
            </p>
          </div> */}

          {/* Glassmorphism Login Card */}
          <div className=" mt-6 backdrop-blur-md bg-white/85 border border-slate-200/80 rounded-2xl shadow-sm p-8 md:p-10">
            <div className="mb-6">
              <h2 className="font-title text-2xl font-semibold text-on-surface mb-2">
                Admin Login
              </h2>
              <p className="text-sm text-on-surface-variant">
                Please choose your preferred login method.
              </p>
            </div>

            {/* Premium Pill-Style Selection Tabs (Email / Phone ရွေးချယ်ရန် နေရာ) */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200/30">
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-title font-bold rounded-lg transition-all duration-300 ${
                  loginMethod === "email"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant/70 hover:text-on-surface"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                <MailOutlined className="mr-1.5!" /> Email Address
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-xs font-title font-bold rounded-lg transition-all duration-300 ${
                  loginMethod === "phone"
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant/70 hover:text-on-surface"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                <PhoneOutlined className="mr-1.5!" /> Phone Number
              </button>
            </div>

            {/* Ant Design Form */}
            <Form
              name="login_form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              requiredMark={false}
              autoComplete="off"
            >
              {/* CONDITIONALLY RENDER: Email Input Field */}
              {loginMethod === "email" && (
                <Form.Item
                  label={
                    <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                      Email Address
                    </span>
                  }
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Email is require !",
                    },
                    {
                      type: "email",
                      message: "Type here",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-outline mr-1.5" />}
                    placeholder="admin@luxemanage.com"
                    className="w-full! px-3! py-2.5! bg-surface/50! border-outline-variant! hover:border-primary! focus:border-primary! rounded-xl! text-sm!"
                  />
                </Form.Item>
              )}

              {/* CONDITIONALLY RENDER: Phone Number Input Field */}
              {loginMethod === "phone" && (
                <Form.Item
                  label={
                    <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                      Phone Number
                    </span>
                  }
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Phone number is require!",
                    },
                    {
                      pattern: /^(09|\+959)\d{7,9}$/,
                      message: "Type here (09xxxxxxxxx)",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-outline mr-1.5" />}
                    placeholder="09XXXXXXXXX"
                    className="w-full! px-3! py-2.5! bg-surface/50! border-outline-variant! hover:border-primary! focus:border-primary! rounded-xl! text-sm!"
                  />
                </Form.Item>
              )}

              {/* Password Field */}
              <Form.Item
                label={
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                      Password
                    </span>
                  </div>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password is require!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-outline mr-1.5" />}
                  placeholder="••••••••"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone twoToneColor="#00236f" />
                    ) : (
                      <EyeInvisibleOutlined className="text-outline" />
                    )
                  }
                  className="w-full! px-3! py-2.5! bg-surface/50! border-outline-variant! hover:border-primary! focus:border-primary! rounded-xl! text-sm!"
                />
              </Form.Item>

              {/* Remember Me */}
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mb-4!"
              >
                <Checkbox className="text-sm! text-on-surface-variant! select-none!">
                  Remember this device
                </Checkbox>
              </Form.Item>

              {/* Submit Button */}
              <Form.Item className="mb-0 pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                  className="w-full! bg-primary! hover:bg-primary-container! text-on-primary! font-title! font-semibold! text-base! h-12! rounded-xl! border-none! flex! items-center! justify-center! space-x-2! transition-all! group!"
                >
                  {loading ? (
                    <>
                      <LoadingOutlined />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                    </>
                  )}
                </Button>
              </Form.Item>
            </Form>

            {/* Support Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200/40 flex flex-col items-center space-y-4">
              <p className="text-xs text-on-surface-variant/60">
                Secure Environment • SSL Encrypted
              </p>
              <div className="flex space-x-6">
                <button className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-medium">
                  <QuestionCircleOutlined />
                  <span>Help</span>
                </button>
                <button className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs font-medium">
                  <GlobalOutlined />
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>

          <footer className="mt-6 text-center opacity-40">
            <p className="text-xs text-on-surface-variant">
              © 2025 Visit 77. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Login;
