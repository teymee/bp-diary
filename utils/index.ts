import { PixelCrop } from "react-image-crop";
import moment from "moment";
import normal from "@/assets/images/normal-bp.svg";
import elevated from "@/assets/images/elevated-bp.svg";
import hbp1 from "@/assets/images/hbp1.svg";
import hbp2 from "@/assets/images/hbp2.svg";
import { useAuthStore } from "@/store/authStore";

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const h = Number(hour);
  const period = h >= 12 ? "pm" : "am";
  const displayHour = h % 12 || 12;

  return `${displayHour}:${minute}${period}`;
};
export const readingsCategories = [
  { label: "Normal", value: "normal" },
  { label: "Elevated", value: "elevated" },
  { label: "High Blood Pressure (Stage 1)", value: "hbp1" },
  { label: "High Blood Pressure (Stage 2)", value: "hbp2" },
];

export const exportToJson = (data: unknown[], filename: string) => {
  if (!data.length) return;

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCsv = (
  data: Record<string, unknown>[],
  filename: string,
) => {
  const headers = Object.keys(data[0]);

  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => row[h]).join(",")),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const getUserId = async () => {
  let userId = useAuthStore.getState().user?.id ?? null;

  if (!userId) {
    return await useAuthStore
      .getState()
      .getUser()
      .then(() => {
        userId = useAuthStore.getState().user?.id ?? null;
        return userId;
      });
  }

  return userId;
};

const hasOffset = (dateStr: string) => {
  const str = String(dateStr);
  const match = str.match(/([+-])(\d{2}):(\d{2})$/);
  if (!match) return false;

  const [, , hours, minutes] = match;
  return !(hours === "00" && minutes === "00");
};
export const formatDate = (date: string, format = "MMM Do, YYYY") => {
  if (date === "N/A") return "N/A";
  if (!date) return;

  const parsedDate = hasOffset(date) ? moment(date) : moment.utc(date);
  return parsedDate.format(format);
};

export const showToast = (
  toast: any,
  severity: "success" | "error",
  summary: string,
  detail: string,
) => {
  toast.current?.show({
    severity,
    summary,
    detail,
    life: 3500,
  });
};
export const readingValidation = ({
  toast,
  session,
  sys,
  dia,
  pulse,
}: {
  toast: any;
  session: string | null;
  sys: number;
  dia: number;
  pulse: number;
}) => {
  if (!session) {
    showToast(
      toast,
      "error",
      "Login required",
      "You need to be logged in to save a reading.",
    );
    return;
  }
  if (!Number.isFinite(sys) || sys <= 0 || !Number.isFinite(dia) || dia <= 0) {
    showToast(
      toast,
      "error",
      "Invalid reading",
      "Enter valid systolic and diastolic values.",
    );
    return;
  }

  if (pulse === null || !Number.isFinite(pulse) || pulse <= 0) {
    showToast(toast, "error", "Invalid pulse", "Enter a valid pulse value.");
    return;
  }
};

export const getLevelImage = (
  sys: number,
  dia: number,
  pulse?: number,
  type?: "text",
) => {
  if (sys < 120 && dia < 80) {
    return type ? "Normal" : normal;
  }
  if (sys >= 120 && sys < 130 && dia < 90) {
    return type ? "Elevated" : elevated;
  }
  if (sys >= 130 && sys < 145 && dia >= 70 && dia < 100) {
    return type ? "High Blood Pressure (Stage 1)" : hbp1;
  }
  if (sys >= 145) {
    return type ? "High Blood Pressure (Stage 2)" : hbp2;
  }
};

export const getPulseLevelColor = (
  pulse: number,
): { textColor: string; bgColor: string; text: string } => {
  if (pulse < 60)
    return {
      textColor: "#074173",
      bgColor: "#E1EFFF",
      text: "Below Normal",
    };

  if (pulse <= 100)
    return {
      textColor: "#00CE9C",
      bgColor: "#D1FAE5",
      text: "Normal",
    };

  return {
    textColor: "#FE5C5C",
    bgColor: "#FFE1E1",
    text: "Above Normal",
  };
};
export const getLevelColor = (level: string, number?: number) => {
  const levelLower = level.toLowerCase();
  if (levelLower === "normal") {
    return "#00CE9C";
  }
  if (levelLower === "elevated") {
    return "#074173";
  }

  if (levelLower === "hbp1") {
    return "#FBAD4B";
  }

  if (levelLower === "hbp2") {
    return "#FE5C5C";
  }
};

export const getLocalStorageService = (key: string) => {
  if (!key) return alert("enter key");

  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem(key) || "null");
};

// Helper to get the cropped image from the canvas
export async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      // Convert Blob to File to match your Server Action's expectation
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}
