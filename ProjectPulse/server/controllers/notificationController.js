const Notification =
  require("../models/Notification");

/* ===========================
   CREATE NOTIFICATION
=========================== */

exports.createNotification =
  async (userId, message) => {

  try {

    await Notification.create({

      userId,
      message

    });

  }

  catch (error) {

    console.error(
      "Notification error:",
      error
    );

  }

};

/* ===========================
   GET NOTIFICATIONS
=========================== */

exports.getNotifications =
  async (req, res) => {

  try {

    const notifications =
      await Notification.find({

        userId: req.user.id

      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifications);

  }

  catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch notifications"

    });

  }

};

/* ===========================
   MARK AS READ
=========================== */

exports.markAsRead =
  async (req, res) => {

  try {

    await Notification.findByIdAndUpdate(

      req.params.id,

      { read: true }

    );

    res.json({

      message:
        "Notification marked read"

    });

  }

  catch (error) {

    res.status(500).json({

      message:
        "Failed to update notification"

    });

  }

};