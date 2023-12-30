const multer = require("multer");
const Image = require("../models/Image");
const router = require("express").Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(upload.single("image"), async (req, res) => {
  try {
    // Lưu ảnh vào MongoDB
    const newImage = new Image({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const newImg = await newImage.save();
    console.log(newImg)

    res.status(201).json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, status: "fail" });
  }
});
router.route("/:id").get(async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}).delete(async (req, res) => {
  try {
    const message = await Image.findByIdAndDelete(req.params.id);
    res.json({message});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router