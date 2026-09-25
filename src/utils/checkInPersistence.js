import dayjs from "dayjs";

const STORAGE_PREFIX = "visit77.checkin.flow.";

export const getCheckInSession = (roomId) => {
  if (!roomId) return null;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${roomId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveCheckInSession = (roomId, patch) => {
  if (!roomId) return;
  try {
    const current = getCheckInSession(roomId) || {};
    sessionStorage.setItem(
      `${STORAGE_PREFIX}${roomId}`,
      JSON.stringify({ ...current, ...patch }),
    );
  } catch (error) {
    console.warn("Failed to persist check-in session", error);
  }
};

export const clearCheckInSession = (roomId) => {
  if (!roomId) return;
  sessionStorage.removeItem(`${STORAGE_PREFIX}${roomId}`);
};

const serializePhotos = (fileList) =>
  (fileList || [])
    .filter((file) => file?.url)
    .map((file) => ({
      uid: file.uid,
      name: file.name,
      status: "done",
      url: file.url,
    }));

export const serializeCheckInFormValues = (values) => {
  if (!values) return null;
  return {
    ...values,
    check_in: values.check_in
      ? dayjs(values.check_in).format("YYYY-MM-DD")
      : null,
    check_out: values.check_out
      ? dayjs(values.check_out).format("YYYY-MM-DD")
      : null,
    guests: (values.guests || []).map((guest) => ({
      ...guest,
      identityPhoto: serializePhotos(guest?.identityPhoto),
    })),
  };
};

export const deserializeCheckInFormValues = (values) => {
  if (!values) return {};
  return {
    ...values,
    check_in: values.check_in ? dayjs(values.check_in) : dayjs(),
    check_out: values.check_out
      ? dayjs(values.check_out)
      : dayjs().add(1, "day"),
  };
};
