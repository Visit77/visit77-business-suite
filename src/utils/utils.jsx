import _ from "lodash";
import { API_URL, TOKEN_LABEL, WEB_URL } from "../variables/constants";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosInstance";

export const decodeToken = (initialState) => {
  const jwt = localStorage.getItem(TOKEN_LABEL);

  if (jwt) {
    const { user_id, phone, email, is_staff, is_superuser, login_type } =
      jwtDecode(jwt);

    return {
      ...initialState,
      isPending: false,
      hasError: false,
      user: { user_id, phone, email, is_staff, is_superuser, login_type },
      // isAuthenticated: moment().isBefore(credential.expiredDate),
      isAuthenticated: true,
    };
  }
  return initialState;
};

// Encoding
export const base64UrlEncode = (str) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Decoding
export const base64UrlDecode = (str) => {
  let base64 = str?.replace(/-/g, "+").replace(/_/g, "/");
  while (base64?.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

export const getRoomCardStyle = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400/80 border-green-400";
    case "occupied":
      return "bg-blue-600/80 border-blue-600";
    case "reserved":
      return "bg-[#FB923C]/80 border-[#FB923C]";
    case "cleaning":
      return "bg-[#7C3AED]/80 border-[#7C3AED]";
    case "out_of_service":
      return "bg-slate-500/80 border-slate-500";
    case "blocked":
      return "bg-white border-black ";

    default:
      return "bg-green-200/80 border-green-200";
  }
};

export const getRoomBorderStyle = (status) => {
  switch (status) {
    case "available":
      return " border-green-400";
    case "occupied":
      return " border-blue-600";
    case "reserved":
      return "order-[#FB923C]";
    case "cleaning":
      return "border-[#7C3AED]";
    case "out_of_service":
      return " border-slate-500";
    case "blocked":
      return "border-black border-2!";

    default:
      return " border-green-200";
  }
};

export const getDotColor = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400 border-green-400";
    case "occupied":
      return "bg-blue-600 border-blue-600";
    case "reserved":
      return "bg-[#FB923C] border-[#FB923C]";
    case "cleaning":
      return "bg-[#7C3AED] border-[#7C3AED]";
    case "out_of_service":
      return "bg-slate-500 border-slate-500";
    case "blocked":
      return "bg-white border-black border-2!";

    default:
      return "bg-green-200 border-green-200";
  }
};

export const nrcCodes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];

export const nrcTypes = [
  { label: "နိုင်", value: "Naing" },
  { label: "ဧည့်", value: "Ae" },
  { label: "ပြု", value: "Puu" },
  { label: "စ", value: "Sa" },
  { label: "သ", value: "Tha" },
  { label: "သသ", value: "ThaTha" },
];

export const nrcTownships = {
  1: [
    { label: "မကန", value: "MaKaNa" },
    { label: "ဗမန", value: "BaMaNa" },
    { label: "ခဖန", value: "KhaPhaNa" },
    { label: "မညန", value: "MaNyaNa" },
    { label: "ပတအ", value: "PaTaA" },
    { label: "ဝမန", value: "WaMaNa" },
    { label: "ရဖန", value: "RaPhaNa" },
  ],
  2: [
    { label: "ဒမဆ", value: "DaMaSa" },
    { label: "လကန", value: "LaKaNa" },
    { label: "ဖရဆ", value: "PhaRaSa" },
    { label: "ဖဆန", value: "PhaSaNa" },
    { label: "ရတန", value: "RaTaNa" },
  ],
  3: [
    { label: "ဘအန", value: "BhaA Na" },
    { label: "ကကရ", value: "KaKaRa" },
    { label: "ကဆန", value: "KaSaNa" },
    { label: "ကအန", value: "KaA Na" },
    { label: "မြဝတ", value: "MyaWaTa" },
  ],
  4: [
    { label: "ဖပန", value: "PhaPaNa" },
    { label: "ဟခန", value: "HaKhaNa" },
    { label: "မတန", value: "MaTaNa" },
    { label: "ပလဝ", value: "PaLaWa" },
  ],
  5: [
    { label: "အရတ", value: "A Ra Ta" },
    { label: "ဗမန", value: "BaMaNa" },
    { label: "ဘမန", value: "BhaMaNa" },
    { label: "ကလဝ", value: "KaLaWa" },
    { label: "စကန", value: "SaKaNa" },
    { label: "ယမသ", value: "YaMaTha" },
  ],
  6: [
    { label: "ထဝန", value: "ThaWaNa" },
    { label: "ကသန", value: "KaThaNa" },
    { label: "မြအန", value: "MyaA Na" },
    { label: "တနသ", value: "TaNaTha" },
  ],
  7: [
    { label: "ကကန", value: "KaKaNa" },
    { label: "ကဝန", value: "KaWaNa" },
    { label: "ပခန", value: "PaKhaNa" },
    { label: "ပတန", value: "PaTaNa" },
    { label: "တငန", value: "TaNgaNa" },
  ],
  8: [
    { label: "ခမန", value: "KhaMaNa" },
    { label: "မကန", value: "MaKaNa" },
    { label: "မလန", value: "MaLaNa" },
    { label: "ပခက", value: "PaKhaKa" },
    { label: "ယနချ", value: "YaNaCha" },
  ],
  9: [
    { label: "အမဇ", value: "AhMaZa" },
    { label: "ခမသ", value: "KhaMaTha" },
    { label: "ကပတ", value: "KaPaTa" },
    { label: "မခန", value: "MaKhaNa" },
    { label: "မတရ", value: "MaTaRa" },
    { label: "ပဘန", value: "PaBhaNa" },
    { label: "စကန", value: "SaKaNa" },
  ],
  10: [
    { label: "ကမရ", value: "KaMaRa" },
    { label: "ခဆန", value: "KhaSaNa" },
    { label: "မလန", value: "MaLaNa" },
    { label: "သထန", value: "ThaThaNa" },
  ],
  11: [
    { label: "အမန", value: "AhMaNa" },
    { label: "ဗသတ", value: "BaThaTa" },
    { label: "ဂအန", value: "GaA Na" },
    { label: "တဂပ", value: "TaGaPa" },
  ],
  12: [
    { label: "မကတ", value: "MaKaTa" },
    { label: "မယက", value: "MaYaKa" },
    { label: "ဒဂန", value: "DaGaNa" },
    { label: "ဒဂတ", value: "DaGaTa" },
    { label: "ဒဂမ", value: "DaGaMa" },
    { label: "ဒဂဆ", value: "DaGaSa" },
    { label: "ဒဂရှ", value: "DaGaSha" },
    { label: "အလန", value: "AhLaNa" },
    { label: "ဗဟန", value: "BaHaNa" },
    { label: "ကမယ", value: "KaMaYa" },
    { label: "ဥကမ", value: "OaKaMa" },
    { label: "သကတ", value: "ThaKaTa" },
    { label: "သဃက", value: "ThaGhaKa" },
    { label: "တမန", value: "TaMaNa" },
    { label: "ရကန", value: "RaKaNa" },
  ],
  13: [
    { label: "ခလန", value: "KhaLaNa" },
    { label: "ဟပန", value: "HaPaNa" },
    { label: "ကလန", value: "KaLaNa" },
    { label: "လခတ", value: "LaKhaTa" },
    { label: "တကန", value: "TaKaNa" },
  ],
  14: [
    { label: "ဘကလ", value: "BhaKaLa" },
    { label: "ဒဒယ", value: "DaDaYa" },
    { label: "ဓနဖ", value: "DhaNaPha" },
    { label: "ဟသတ", value: "HaThaTa" },
    { label: "ပသန", value: "PaThaNa" },
    { label: "ဇလန", value: "ZaLaNa" },
  ],
};

export const ratingOption = [
  {
    label: "Hotal",
    value: "zero",
  },
  {
    label: "1 Star",
    value: "one",
  },
  {
    label: "2 Stars",
    value: "two",
  },
  {
    label: "3 Stars",
    value: "three",
  },
  {
    label: "4 Stars",
    value: "four",
  },
  {
    label: "5 Stars",
    value: "five",
  },
  {
    label: "6 Stars",
    value: "six",
  },
  {
    label: "7 Stars",
    value: "seven",
  },
];
