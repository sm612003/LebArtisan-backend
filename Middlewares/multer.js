// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("reached here");
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     console.log("Mutler", file);
//     let ext = file.originalname.split(".")[1];
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const uploadImage = multer({ storage: storage });
// export default uploadImage;
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      // Handle image uploads
      cb(null, "images");
    } else if (file.mimetype.startsWith('video')) {
      // Handle video uploads
      cb(null, "videos");
    } else {
      // Invalid file type
      cb(new Error('Invalid file type'));
    }
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(
      null,
      file.fieldname + "-" + Date.now() + ext
    );
  },
});

const upload = multer({ storage: storage });

export default upload;
