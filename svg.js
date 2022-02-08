import jimp from "jimp";

const getSVG = async (text) => {
  console.log(text);
  const jimpImg = await jimp.read("./base.png");

  const date = new Date();

  const image = await jimp
    .loadFont("./67s8KFihePTg3bgBBnjEoj1n.ttf.fnt")
    .then((font) => {
      jimpImg.print(font, 302, 390, text, 1621);
      jimpImg.print(
        font,
        302,
        744,
        `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        1621
      );

      return jimpImg;
    })
    .then((image) => {
      return image;
    });

  return image;
};

export { getSVG };
