// 웹푸시 구독 — VAPID 공개키로 PushManager 구독 → 서버 저장. 미지원/거부/키없음은 graceful.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

import { apiVapidPublicKey, apiSaveSubscription } from "./apiClient";

export type PushResult = "ok" | "unsupported" | "denied" | "no-key" | "error";

// 푸시 알림 켜기 — 권한 요청 → SW 등록 → 구독 → 서버 저장.
export async function enablePush(serverId: string): Promise<PushResult> {
  try {
    if (typeof window === "undefined") return "unsupported";
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      return "unsupported";
    }
    const keyRes = await apiVapidPublicKey();
    const key = keyRes?.key;
    if (!key) return "no-key"; // 서버에 VAPID 미설정 → 인앱 알림만
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return "denied";
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      });
    }
    const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
    await apiSaveSubscription(serverId, {
      endpoint: json.endpoint,
      keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    });
    return "ok";
  } catch {
    return "error";
  }
}
