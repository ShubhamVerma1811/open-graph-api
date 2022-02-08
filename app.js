import express, { json, urlencoded } from "express";
import jimp from "jimp";

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.type("jpg");
  res.attachment("output.png");
  const font = await jimp.loadFont("./67s8KFihePTg3bgBBnjEoj1n.ttf.fnt");

  jimp.read("base.png", async (err, lenna) => {
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
      .writeAsync("output.png"); // save
    res.download("output.png");
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
