import multer from "multer";
import path from "path";

// STORAGE
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//FILEFILTER
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images!"), false);
  }
};

// CONCLUSION 😍
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// *******
const getUploads = (req, res, next) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: "Image téléchargée avec succes",
      image: `/${req.file.path}`,
    });
  });
};

export { getUploads };
