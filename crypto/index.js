import crypto from "crypto";
import { BACKEND_URL } from "../production.config.js";

const ENCRYPTION_KEY = "31a4135318fb765bb037aa53ee1ed3ed";
const IVString = "4690ed68f7b720fcbe2b820d8307cb67";
const IV = Buffer.from(IVString, "hex");

const hashsha = (text) => {
  return crypto.createHash("sha256").update(text).digest("base64");
};

const encryptData = (rawData) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(rawData.concat(hashsha(rawData)));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("base64");
};

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);
  let data = decipher.update(encryptedData, "base64", "ascii");
  data += decipher.final();
  return data.substring(0, data.length - 44);
};

export const decryptPaymentDataToJson = (encryptedData) => {
  const raw = decryptData(encryptedData);
  const responseArr = raw.split("&");
  return {
    kriyaId: responseArr[0],
    categoryid: parseInt(responseArr[1], 10),
    transactionid: responseArr[2],
    status: parseInt(responseArr[3], 10),
  };
};

const formatPaymentUrl = (encryptedData) => {
  return `https://cms.psgps.edu.in/payapp?payment=${encryptedData}`;

  //return `https://ims.psgtech.ac.in/payapp?payment=${encryptedData}`;

  //return `https://ecampus.psgtech.ac.in/payapP?payment=${encryptedData}`;
};

export const generateEncryptedPaymentData = (
  transactionId,
  kriyaId,
  email,
  name,
  fee
) => {
  const redirectURL = `${BACKEND_URL}/api/payment/confirm`;
  const raw = `regid=${kriyaId} name=${name.replace(
    /\s/g,
    "$"
  )} email=${email} categoryid=21 transactionid=${transactionId} fees=${fee} returnurl=${redirectURL}`;
  return formatPaymentUrl(encryptData(raw));
};
