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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TOKEN_LABEL } from "../variables/constants";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      localStorage.setItem(TOKEN_LABEL, "mock-luxury-admin-token-xyz");

      message.success("Login Successful!");
      navigate("/dashboard", { replace: true });
    }, 1500);
  };

  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex items-center justify-center overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsP6yMuOwD0wIjbVitZIZ5nGuNa7W2UzQ87D-cHCJoXTYQOTE5PD0q52OhIDMxiTBfU_VlC-oE3jZqZt2b1qlQbkMfnferjXJWai9Mxk4_e6lPj7pzdaP-2vhpj4CVyqg6CbdrBMXQMokbbAjn4HVzfaq_YcrjCJut6ffRNr0f7tNhIepldEXHTJIvVxrRCWO_hu7wkSpalR7xjKhmLhhDY1h3NTG9GmLNzrm8VtG4YqUno4SaZHFRsC69lfEULhjsxUzMwapIam8')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-[#e5eeff] opacity-70" />
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Branding Header */}

          {/* Glassmorphism Login Card */}
          <div className="backdrop-blur-md bg-white/85 border border-slate-200/80 rounded-2xl shadow-sm p-8 md:p-10 transition-all duration-500 hover:shadow-lg">
            <div className="mb-6">
              <h2 className="font-title text-2xl font-semibold text-on-surface mb-2">
                Admin Login
              </h2>
              <p className="text-sm text-on-surface-variant">
                Please enter your credentials to access the management
                dashboard.
              </p>
            </div>

            {/* Ant Design Form with custom styling integration */}
            <Form
              name="login_form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              requiredMark={false}
              autoComplete="off"
            >
              {/* Email Field */}
              <Form.Item
                label={
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase font-sans">
                    Email Address
                  </span>
                }
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email address!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-outline mr-1.5" />}
                  placeholder="admin@luxemanage.com"
                  className="w-full px-3! py-2.5! border-outline-variant! hover:border-primary! focus:border-primary! rounded-xl text-sm transition-all shadow-sm"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label={
                  <span className="text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase font-sans">
                    Password
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
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
                  className="w-full px-3! py-2.5! border-outline-variant! hover:border-primary! focus:border-primary! rounded-xl text-sm transition-all shadow-sm"
                />
              </Form.Item>

              {/* Remember Me */}
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mb-4"
              >
                <Checkbox className="text-sm text-on-surface-variant select-none">
                  Remember this device
                </Checkbox>
              </Form.Item>

              {/* Submit CTA Button */}
              <Form.Item className="mb-0 pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                  className="w-full bg-primary! hover:bg-primary-container! text-on-primary! font-title! font-semibold! text-base! h-12! rounded-xl! shadow-sm! border-none! flex! items-center! justify-center! space-x-2! transition-all! active:scale-[0.98]! group!"
                >
                  {loading ? (
                    <>
                      <LoadingOutlined />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span className=" mr-3">Login to Dashboard</span>
                      <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
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
            </div>
          </div>

          {/* Footer Copyright */}
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
