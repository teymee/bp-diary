import { supabase } from "@/lib/supabase/client";
import { urlBase64ToUint8Array } from "@/utils";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications.");
  }

  const permission = await Notification.requestPermission();

  return permission;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported.");
  }

  return navigator.serviceWorker.register("/service-worker.js");
}

export const disablePushNotification = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();

    await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", subscription.endpoint);
  }
};

export const enablePushNotification = async (userId: string) => {
  const permission = await requestNotificationPermission();

  console.log(permission, "request permssion response");

  if (permission !== "granted") {
    return;
  }

  const registration = await registerServiceWorker();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    ),
  });

  const json = subscription.toJSON();
  console.log(json, "subsciption in json format");

  const { data } = await supabase.from("push_subscriptions").upsert({
    user_id: userId,
    endpoint: json.endpoint,
    auth: json.keys?.auth,
    p256dh: json.keys?.p256dh,
  });

  return data;
};
