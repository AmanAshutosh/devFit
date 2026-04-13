import { useEffect, useCallback } from "react";

export const useNotifications = (gymTime) => {
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const result = await Notification.requestPermission();
    return result === "granted";
  }, []);

  const sendNotification = useCallback((title, body, icon = "/logo192.png") => {
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, icon });
  }, []);

  // Schedule daily gym reminder
  useEffect(() => {
    if (!gymTime || Notification.permission !== "granted") return;

    const [hours, minutes] = gymTime.split(":").map(Number);

    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        sendNotification(
          "💪 devFit — Gym Time!",
          `It's ${gymTime} — time to crush your workout!`,
        );
      }
    };

    const interval = setInterval(checkTime, 60000); // check every minute
    return () => clearInterval(interval);
  }, [gymTime, sendNotification]);

  return { requestPermission, sendNotification };
};
