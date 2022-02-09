import express, { json, urlencoded } from "express";
import jimp from "jimp";
import path from "path";

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async (req, res) => {
  console.log(
    path.join(__dirname, "../public/67s8KFihePTg3bgBBnjEoj1n.ttf.fnt")
  );

  if (!req.body?.title) {
    res.type("jpg");
    res.sendFile(path.join(__dirname, "../public/base.png"));
    return;
  }

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  const font = await jimp.loadFont(
    path.join(__dirname, "../public/67s8KFihePTg3bgBBnjEoj1n.ttf.fnt")
  );

  jimp.read(
    path.join(__dirname, "../public/base.png"),

    async (err, lenna) => {
      if (err) throw err;

      const date = new Date();

      const image = await lenna
        .print(font, 302, 390, req.body?.title, 1621)
        .print(
          font,
          302,
          744,
          `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
          1621
        )
        .quality(100);

      image.getBase64(jimp.AUTO, (err, src) => {
        if (err) throw err;
        const base64Img = src.split(",")[1];

        const buffer = new Buffer.from(
          base64Img.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        res.writeHead(200, {
          "Content-Type": "image/png",
        });

        res.download(buffer, "image.png");
      });
    }
  );
});

module.exports = app;
