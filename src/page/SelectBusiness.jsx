import React, { useEffect, useState } from "react";
import { message } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BusinessCard from "../components/card/BusinessCard";
import PageLoading from "../components/PageLoading";
import { useDispatch, useSelector } from "react-redux";
import {
  businessSelector,
  getBusiness,
  selectedBusiness,
} from "../service/businessSlice";
import { authSelector } from "../service/authSlice";

const SelectBusiness = () => {
  const navigate = useNavigate();
  const { user } = useSelector(authSelector);
  const { data: business, isPending } = useSelector(businessSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getBusiness({ owner: user?.user_id }));
    }
  }, [user, dispatch]);

  const handleSelectBusiness = (id) => {
    const chosenBusiness = business.find((b) => b.id === id);
    if (!chosenBusiness) return;

    dispatch(selectedBusiness(chosenBusiness));

    setTimeout(() => {
      message.success({
        content: ` The choice of ${chosenBusiness.name_1} is successful.`,
        key: "business-select",
        duration: 2,
      });
      navigate("/dashboard");
    }, 1200);
  };

  if (isPending) {
    return <PageLoading message="Loading businesses..." />;
  }

  return (
    <div className="min-h-screen! bg-[#FAFBFD]! flex! flex-col! justify-center! py-12! px-4! sm:px-6! lg:px-8! font-sans!">
      <div className="max-w-4xl! w-full! mx-auto! space-y-8! md:space-y-10!">
        <div className="text-center! space-y-3!">
          <div className="inline-flex! items-center! justify-center! w-14! h-14! bg-blue-50! text-[#0F296D]! rounded-2xl! border! border-blue-100/30! mb-1!">
            <ShopOutlined className="text-2xl!" />
          </div>
          <h1 className="font-title! text-2xl! md:text-3xl! font-bold! text-slate-800! tracking-tight!">
            Select Business Office
          </h1>
          <p className="text-xs! md:text-sm! text-slate-400! font-medium! max-w-md! mx-auto! leading-relaxed!">
            Please choose a business location to manage bookings, guest
            registries, and room services.
          </p>
        </div>

        <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-5! md:gap-6!">
          {business.map((biz) => (
            <BusinessCard
              key={biz.id}
              onSelect={() => handleSelectBusiness(biz?.id)}
              business={biz}
            />
          ))}
        </div>

        <div className="text-center! pt-2!">
          <p className="text-xs! text-slate-400! font-medium!">
            Need to add a new outlet business? Contact your{" "}
            <span className="text-[#0F296D]! font-bold! cursor-pointer! hover:underline!">
              System Administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectBusiness;
