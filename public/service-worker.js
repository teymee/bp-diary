// 🚨 Registration & Activation
self.addEventListener("install", () => {
  console.log("Service worker installed");
});

self.addEventListener("activate", () => {
  console.log("Service worker activated");
});

// 🚨 Push notification

self.addEventListener("push", (event) => {
  const data = event.data.json();

  console.log(data);
});

// {
//     "endpoint": "https://fcm.googleapis.com/fcm/send/fTr3b5tSUmY:APA91bGqkCmfne561Q2WFF5UcyZa9G0u21hw2hZQzUv0DGovaoHAdBbY2z600Vg8VxBbpC6ZQWy_nlIrv0grJJs7ZDPTfq4xCHcvEJ38RHmbjHj1L553vMcDu_6FA1qIeF6qxU_Gh8vZ",
//     "expirationTime": null,
//     "keys": {
//         "p256dh": "BEA7ORaOXMFwfdBQsyA-T-TS2Cx3Z3or6K17kNMMCZSb6FzMbFT5Vu5NwaJ6Yqg4IRE4iUHQpIViTzfBcSyVCmo",
//         "auth": "WwzDydKYJ2Jzzr-4qpbPAA"
//     }
// }
