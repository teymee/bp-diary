
import { PixelCrop } from "react-image-crop";

export const showToast = (toast: any, severity: 'success' | 'error', summary: string, detail: string) => {
  toast.current?.show({
    severity,
    summary,
    detail,
    life: 3500,
  })
}
export const readingValidation = ({ toast, session, sys, dia, pulse }: { toast: any, session: string | null, sys: number, dia: number, pulse: number }) => {
  if (!session) {
    showToast(toast, 'error', 'Login required', 'You need to be logged in to save a reading.')
    return
  }
  if (!Number.isFinite(sys) || sys <= 0 || !Number.isFinite(dia) || dia <= 0) {
    showToast(toast, 'error', 'Invalid reading', 'Enter valid systolic and diastolic values.')
    return
  }

  if (pulse === null || !Number.isFinite(pulse) || pulse <= 0) {
    showToast(toast, 'error', 'Invalid pulse', 'Enter a valid pulse value.')
    return
  }

}
export const getLevelColor = (level: string, number?: number) => {
  const levelLower = level.toLowerCase()
  if (levelLower === "normal") {
    return "#00CE9C"
  }
  if (levelLower === "elevated") {
    return "#074173"
  }

  if (levelLower === "hbp1") {
    return "#FBAD4B"
  }

  if (levelLower === "hbp2") {
    return "#FE5C5C"
  }
}

export const getLocalStorageService = (key: string) => {
  if (!key) return alert("enter key");

  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem(key) || "null");
};

// Helper to get the cropped image from the canvas
export async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
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
    crop.height
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
