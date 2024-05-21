import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    let prefix;
    if (req.originalUrl.includes("users")) prefix = "avatar";
    else if (req.originalUrl.includes("posts")) prefix = "post";

    const fileName =
      prefix + "-" + file.originalname + "-" + new Date().toISOString();
    cb(null, fileName);
  },
});

export const fileUpload = multer({ storage });
