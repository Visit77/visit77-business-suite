import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import { LoadingOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BusinessCard from "../components/card/BusinessCard";
import { useDispatch, useSelector } from "react-redux";
import { getBusiness } from "../service/businessSlice";
import { userSelector } from "../service/userSlice";

const SelectBusiness = () => {
  const navigate = useNavigate();
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const branches = [
    {
      id: "b-1",
      name: "Yangon Head Office",
      location: "No. 123, Pyay Road, Kamayut Township, Yangon.",
      phone: "+95 9 123 456 789",
    },
    {
      id: "b-2",
      name: "Mandalay Branch",
      location: "No. 45, 78th Street, Chanayethazan Township, Mandalay.",
      phone: "+95 9 987 654 321",
    },
    {
      id: "b-3",
      name: "Naypyidaw Branch",
      location: "Yaza Thingaha Road, Dekkhinathiri Township, Naypyidaw.",
      phone: "+95 9 456 789 123",
    },
  ];

  const handleSelectBusiness = (id) => {
    setSelectedBranchId(id);
    setLoading(true);

    const chosenBranch = branches.find((b) => b.id === id);
    message.loading({
      content: `${chosenBranch.name} သို့ ချိတ်ဆက်နေပါသည်...`,
      key: "branch-select",
    });

    setTimeout(() => {
      message.success({
        content: `${chosenBranch.name} ကို ရွေးချယ်မှု အောင်မြင်ပါသည်။`,
        key: "branch-select",
        duration: 2,
      });
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen! bg-[#FAFBFD]! flex! flex-col! justify-center! py-12! px-4! sm:px-6! lg:px-8! font-sans!">
      <div className="max-w-4xl! w-full! mx-auto! space-y-8! md:space-y-10!">
        <div className="text-center! space-y-3!">
          <div className="inline-flex! items-center! justify-center! w-14! h-14! bg-blue-50! text-[#0F296D]! rounded-2xl! border! border-blue-100/30! mb-1!">
            {loading ? (
              <Spin
                indicator={
                  <LoadingOutlined className="text-xl! text-[#0F296D]!" spin />
                }
              />
            ) : (
              <ShopOutlined className="text-2xl!" />
            )}
          </div>
          <h1 className="font-title! text-2xl! md:text-3xl! font-bold! text-slate-800! tracking-tight!">
            Select Branch Office
          </h1>
          <p className="text-xs! md:text-sm! text-slate-400! font-medium! max-w-md! mx-auto! leading-relaxed!">
            Please choose a branch location to manage bookings, guest
            registries, and room services.
          </p>
        </div>

        <div className="grid! grid-cols-1! sm:grid-cols-2! lg:grid-cols-3! gap-5! md:gap-6!">
          {branches.map((branch) => (
            <BusinessCard
              key={branch.id}
              id={branch.id}
              name={branch.name}
              location={branch.location}
              phone={branch.phone}
              isActive={selectedBranchId === branch.id}
              onSelect={handleSelectBusiness}
            />
          ))}
        </div>

        <div className="text-center! pt-2!">
          <p className="text-xs! text-slate-400! font-medium!">
            Need to add a new outlet branch? Contact your{" "}
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
