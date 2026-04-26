import { useEffect, useState, useRef }
from "react";
import socket from "../socket";

import {
  getNotifications,
  markNotificationRead
}
from "../services/notificationService";

function NotificationBell() {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const dropdownRef = useRef(null);

  /* ===========================
     FETCH NOTIFICATIONS
  =========================== */

  const fetchNotifications =
    async () => {

    try {

      const res =
        await getNotifications();

      setNotifications(
        res.data
      );

    }

    catch (error) {

      console.error(
        "Notification fetch failed",
        error
      );

    }

  };

/* ===========================
   INITIAL LOAD + REALTIME
=========================== */

useEffect(() => {

  /* Initial Load */

  fetchNotifications();

  /* Listen for realtime notifications */

  socket.on(
    "newNotification",
    (data) => {

      console.log(
        "New notification received:",
        data
      );

      fetchNotifications();

    }
  );

  /* Optional fallback polling (every 60 sec) */

  const interval =
    setInterval(
      fetchNotifications,
      60000
    );

  return () => {

    socket.off("newNotification");

    clearInterval(interval);

  };

}, []);

  /* ===========================
     CLOSE ON OUTSIDE CLICK
  =========================== */

  useEffect(() => {

    const handleClickOutside =
      (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* ===========================
     UNREAD COUNT
  =========================== */

  const unreadCount =
    notifications.filter(
      n => !n.read
    ).length;

  /* ===========================
     MARK AS READ
  =========================== */

  const handleRead =
    async (id) => {

    try {

      await markNotificationRead(id);

      fetchNotifications();

    }

    catch (error) {

      console.error(
        "Mark read failed",
        error
      );

    }

  };

  return (

    <div
      className="relative"
      ref={dropdownRef}
    >

      {/* Bell Button */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          text-2xl
          hover:scale-110
          transition
        "
      >

        🔔

        {/* Unread Badge */}

        {unreadCount > 0 && (

          <span
            className="
              absolute
              -top-1
              -right-1
              bg-red-500
              text-white
              text-xs
              px-1.5
              py-0.5
              rounded-full
            "
          >

            {unreadCount}

          </span>

        )}

      </button>

      {/* Dropdown Panel */}

      {open && (

        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            bg-white
            shadow-xl
            rounded-lg
            overflow-hidden
            z-50
          "
        >

          {/* Header */}

          <div
            className="
              px-4
              py-2
              font-semibold
              border-b
              bg-gray-50
            "
          >

            Notifications

          </div>

          {/* Notification List */}

          <div
            className="
              max-h-64
              overflow-y-auto
            "
          >

            {notifications.length === 0 ? (

              <div
                className="
                  p-4
                  text-sm
                  text-gray-500
                "
              >

                No notifications yet

              </div>

            ) : (

              notifications.map(n => (

                <div
                  key={n._id}
                  onClick={() =>
                    handleRead(n._id)
                  }
                  className={`
                    px-4
                    py-3
                    border-b
                    cursor-pointer
                    hover:bg-gray-100
                    ${
                      !n.read
                        ? "font-semibold bg-gray-50"
                        : "text-gray-600"
                    }
                  `}
                >

                  {n.message}

                </div>

              ))

            )}

          </div>

        </div>

      )}

    </div>

  );

}

export default NotificationBell;