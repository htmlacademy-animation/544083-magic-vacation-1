import throttle from 'lodash/throttle';
import accentTypographyList from "./accent-typography-list";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.SCREEN_ACTIVE_TIMEOUT = 100;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.activeScreenTimer = null;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  addActiveClassOnDisplay() {
    this.screenElements[this.activeScreen].classList.add(`active`);
    window.clearTimeout(this.activeScreenTimer);
  }

  toggleActiveScreen() {
    this.screenElements.forEach((screen) => {
      const clsList = screen.classList;
      clsList.add(`screen--hidden`);
      clsList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);

    accentTypographyList.introTitleTop.destroyAnimation();
    setTimeout(() => {
      accentTypographyList.introTitleTop.runAnimation();
    }, 200);

    accentTypographyList.introTitleBottom.destroyAnimation();
    setTimeout(() => {
      accentTypographyList.introTitleBottom.runAnimation();
    }, 450);

    accentTypographyList.introDate.destroyAnimation();
    setTimeout(() => {
      accentTypographyList.introDate.runAnimation();
    }, 1000);

    accentTypographyList.sliderTitle.destroyAnimation();
    setTimeout(() => {
      accentTypographyList.sliderTitle.runAnimation();
    }, 5);

    accentTypographyList.prizeTitle.destroyAnimation();
    setTimeout(() => {
      accentTypographyList.prizeTitle.runAnimation();
    }, 5);

    this.activeScreenTimer = window.setTimeout(() => this.addActiveClassOnDisplay(), this.SCREEN_ACTIVE_TIMEOUT);
  }

  changeVisibilityDisplay() {
    const activeScreen = this.screenElements[this.activeScreen];
    const bg = document.querySelector(`.js--screen--bg`);
    const activeScreenElement = document.querySelector(`.screen.active`);

    if (activeScreenElement && activeScreenElement.classList.contains(`screen--story`) && activeScreen.classList.contains(`screen--prizes`)) {
      bg.classList.add(`visible`);
      bg.addEventListener(`transitionend`, (e) => {
        if (e.propertyName === `transform`) {
          this.toggleActiveScreen();
        }

        if (e.propertyName === `opacity`) {
          bg.classList.remove(`visible`);
        }
      });
    } else {
      this.toggleActiveScreen();
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
