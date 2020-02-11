const express = require("express");
const router = express.Router();
const disk = require("diskusage");
const os = require("os");

router.get("/SpaceRemaining", (req, res) => {
  let path = os.platform() === "win32" ? "c:" : "/media/usb/";

  try {
    let info = disk.checkSync(path);

    return res
      .status(200)
      .json((info.free / 1000000000).toFixed(2) + " gigs remaining");
  } catch (err) {
    console.log(err);
    return err;
  }
});

module.exports = router;
