import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("test");
});

app.listen(3000);
