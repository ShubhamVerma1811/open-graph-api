import express, { json, urlencoded } from "express";
import jimp from "jimp";
import path from "path";

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  if (!req.body?.title) {
    res.type("jpg");
    res.sendFile(path.join(__dirname, "../public/base.png"));
    return;
  }

  res.type("jpg");
  res.attachment(path.join(__dirname, "../public/output.png"));
  const font = await jimp.loadFont(
    path.join(__dirname, "../public/67s8KFihePTg3bgBBnjEoj1n.ttf.fnt")
  );

  jimp.read(
    path.join(__dirname, "../public/base.png"),

    async (err, lenna) => {
      if (err) throw err;

      const date = new Date();

      await lenna
        .print(font, 302, 390, req.body?.title, 1621)
        .print(
          font,
          302,
          744,
          `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
          1621
        )
        .quality(100)
        .writeAsync(path.join(__dirname, "../public/output.png")); // save
      res.download(path.join(__dirname, "../public/output.png"));
    }
  );
});

module.exports = app;
