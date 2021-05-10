import AccentTypographyBuild from "./accent-typography-build";

export default {
  introTitleTop: new AccentTypographyBuild(`.intro__title-top`),
  introTitleBottom: new AccentTypographyBuild(`.intro__title-bottom`),
  introDate: new AccentTypographyBuild(`.intro__date`, 400),
  sliderTitle: new AccentTypographyBuild(`.slider__item-title`, 300),
  prizeTitle: new AccentTypographyBuild(`.prizes__title`, 300),
};
