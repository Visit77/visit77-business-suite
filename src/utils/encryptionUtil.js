import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY } from "../variables/constants";

const SECRET_KEY = ENCRYPTION_KEY;

export const encryptData = (data) => {
  try {
    const dataString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
