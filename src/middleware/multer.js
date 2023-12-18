const multer = require("multer");


const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "./uploads");
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
