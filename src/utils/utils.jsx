import _ from "lodash";
import { TOKEN_LABEL } from "../variables/constants";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { message } from "antd";

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
    label: "Hotel",
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

export const MEAL_SECTIONS = [
  {
    key: "default_breakfast",
    title: "Breakfast (Default to show in room amenity)",
  },
  { key: "breakfast", title: "Other Breakfast" },
  { key: "lunch", title: "Lunch" },
  { key: "dinner", title: "Dinner" },
  { key: "drinks", title: "Drink" },
  { key: "other_meal", title: "Other Meal" },
];

export const MEAL_PLAN_PACKAGE_SECTIONS = [
  { key: "half_board", title: "Half Board" },
  { key: "full_board", title: "Full Board" },
  { key: "all_inclusive", title: "All Inclusive" },
];

export const convertTo24Hour = (timeStr) => {
  if (!timeStr) return "";

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes}`;
};

export const parseTimeString = (timeStr, defaultTime) => {
  if (!timeStr) return dayjs(defaultTime, "hh:mm A");

  if (dayjs(timeStr, "HH:mm", true).isValid()) {
    return dayjs(timeStr, "HH:mm");
  }

  if (dayjs(timeStr, "hh:mm A", true).isValid()) {
    return dayjs(timeStr, "hh:mm A");
  }

  return dayjs(timeStr, "HH:mm");
};

export const handleDownload = ({ url }) => {
  if (url) {
    window.open(`${url}`, "_blank");
  } else {
    message.warning("PDF url not available!");
  }
};

export const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });

const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });

export const compressImageToMaxSize = async (
  file,
  maxBytes = MAX_FILE_SIZE_BYTES,
) => {
  if (!file || file.size <= maxBytes) {
    return file;
  }

  const img = await loadImageElement(file);
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  // အလွန်ကြီးမားတဲ့ resolution ဖြစ်နေရင် အစကတည်းက max 1920px ထဲ ချိန်ညှိခြင်း
  const maxDimension = 1920;
  if (width > maxDimension || height > maxDimension) {
    const scale = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const outputName = `${baseName}.jpg`;

  let bestBlob = null;

  for (let dimensionAttempt = 0; dimensionAttempt < 4; dimensionAttempt++) {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.85;
    while (quality >= 0.3) {
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (blob) {
        bestBlob = blob;
        if (blob.size <= maxBytes) {
          return new File([blob], outputName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
      }
      quality = Number((quality - 0.1).toFixed(2));
    }

    // Quality 0.3 အထိ ချပြီးသော်လည်း 1.5 MB ထက် ကျော်နေသေးပါက dimension ထပ်လျှော့မည်
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
  }

  if (bestBlob) {
    return new File([bestBlob], outputName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }

  return file;
};
