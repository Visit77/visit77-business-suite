import React from "react";
import { Select, Avatar } from "antd";
import { useLanguage } from "../context/LanguageContext";
import { useSelector } from "react-redux";
import { API_URL } from "../variables/constants";
import { languageSelector } from "../service/languageSlice";

const LanguageSelect = () => {
  const { data, isPending } = useSelector(languageSelector);

  const langOption = data?.map((lang) => ({
    label: (
      <div className="flex justify-center items-center">
        <Avatar size="small" shape="square" src={`${API_URL}${lang?.icon}`} />
      </div>
    ),
    value: lang?.lang_code, // ✅ Fixed: 'value' instead of 'values'
  }));

  const { language, changeLanguage } = useLanguage();

  return (
    <Select
      style={{ width: "60px" }}
      variant="borderless"
      options={langOption}
      styles={{ borderRadius: 8, width: 70 }}
      suffixIcon={null}
      defaultValue={language}
      loading={isPending}
      onChange={(e) => {
        changeLanguage(e);
      }}
    />
  );
};

export default LanguageSelect;
