import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("DESDE API/USUARIOS");
});

export default router;
