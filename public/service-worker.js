// 🚨 Registration & Activation
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error("Failed to parse push data:", error);
  }

  const title = data.title || "BP Diary Reminder";

  const options = {
    body: data.body || "It's time to record your blood pressure.",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-96.png",
    data: {
      url: data.url || "/add-reading",
      reminderId: data.reminderId,
    },
  };

  if (data.reminderId) {
    options.tag = `bp-diary-reminder-${data.reminderId}`;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/add-reading",
    self.location.origin,
  );

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const existingClient = windowClients.find((client) => {
          const clientUrl = new URL(client.url);
          return clientUrl.origin === targetUrl.origin;
        });

        if (existingClient) {
          return existingClient.navigate(targetUrl.href).then(() => existingClient.focus());
        }

        return clients.openWindow(targetUrl.href);
      }),
  );
});
// {
//     "endpoint": "https://fcm.googleapis.com/fcm/send/fTr3b5tSUmY:APA91bGqkCmfne561Q2WFF5UcyZa9G0u21hw2hZQzUv0DGovaoHAdBbY2z600Vg8VxBbpC6ZQWy_nlIrv0grJJs7ZDPTfq4xCHcvEJ38RHmbjHj1L553vMcDu_6FA1qIeF6qxU_Gh8vZ",
//     "expirationTime": null,
//     "keys": {
//         "p256dh": "BEA7ORaOXMFwfdBQsyA-T-TS2Cx3Z3or6K17kNMMCZSb6FzMbFT5Vu5NwaJ6Yqg4IRE4iUHQpIViTzfBcSyVCmo",
//         "auth": "WwzDydKYJ2Jzzr-4qpbPAA"
//     }
// }
