import api from "./api";

/* GET NOTIFICATIONS */

export const getNotifications =
  () => api.get("/notifications");

/* MARK READ */

export const markNotificationRead =
  (id) =>
    api.put(
      `/notifications/${id}/read`
    );