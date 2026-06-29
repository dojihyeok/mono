// MONO 웹푸시 서비스워커 — push 수신 시 알림 표시, 클릭 시 앱 포커스/이동.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }
  const title = data.title || "MONO 알림";
  const body = data.body || "";
  const url = data.url || "/mono";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/mono";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const c of list) {
          if (c.url.includes("/mono") && "focus" in c) return c.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      }),
  );
});
