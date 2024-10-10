const BaseController = require("../base");
const express = require("express");
const { memory, disk } = require("../../middlewares/upload");
const { authorize } = require("../../middlewares/authorization");
const { uploader } = require("../../helpers/cloudinary");
const router = express.Router();

class UploadController extends BaseController {
  constructor() {
    super();
    router.post("/", authorize, memory.single("file"), this.upload);
    router.post("/local", authorize, disk.single("file"), this.uploadDisk);
  }

  upload = async (req, res, next) => {
    try {
      const { mimetype, buffer } = req.file;
      const allowedFile = [
        "image/jpeg", // jpeg, jpg
        "image/png", // png
        "image/svg+xml", // svg
        "application/pdf", // pdf
        "application/vnd.ms-excel", // xls
        "text/csv", // csv
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // xlsx
      ];

      if (!allowedFile.includes(mimetype)) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("File type not allowed"));
      }

      const fileBase64 = buffer.toString("base64");
      const fileDataUri = `data:${mimetype};base64,${fileBase64}`;
      const fileUpload = await uploader.upload(fileDataUri, {
        resource_type: "auto"
      });

      const { secure_url, height, width, resource_type, format } = fileUpload;

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "File uploaded successfully",
          data: {
            url: secure_url,
            height,
            width,
            resource_type,
            format
          }
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };

  uploadDisk = async (req, res, next) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { mimetype, buffer } = req.file;
      const allowedFile = [
        "image/jpeg", // jpeg, jpg
        "image/png", // png
        "image/svg+xml", // svg
        "application/pdf", // pdf
        "application/vnd.ms-excel", // xls
        "text/csv", // csv
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // xlsx
      ];

      if (!allowedFile.includes(mimetype)) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("File type not allowed"));
      }

      const proxyHost = req.headers["x-forwarded-host"] || req.headers.host;

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "File uploaded successfully",
          data: {
            originalname: req.file.originalname,
            url: `http://${proxyHost}/public/uploads/${req.file.filename}`
          }
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-undef
      next(new ServerError(error));
    }
  };
}

new UploadController();

module.exports = router;
