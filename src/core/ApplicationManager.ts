import Vue from "vue";
import store from "@/store";
import { Category } from "./Data";

const COMPACT_DRAWER_WIDTH = 50;
class ApplicationManager {
  private mainContainerId?: string;
  private vue = new Vue({ store });

  setupLandingPage(titlebar: string, containerId: string, sideId: string, contentId: string) {
    const container = document.getElementById(containerId)!;
    const side = document.getElementById(sideId)!;
    const content = document.getElementById(contentId)!;

    const resize = () => {
      container.style.width = `${window.innerWidth}px`;
      container.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    container.style.display = "grid";
    container.style.gridTemplateColumns = `${this.vue.$store.getters.drawerWidth}px repeat(5, 1fr)`;

    container.style.gridTemplateRows = `${titlebar}px repeat(5, 1fr)`;

    side.style.gridColumn = "1 / 2";
    side.style.gridRow = "2 / 7";

    content.style.gridColumn = "2 / 7";
    content.style.gridRow = "2 / 7";

    this.mainContainerId = containerId;
  }

  setupNotesPage(
    titlebar: number,
    categoryContainerId: string,
    containerId: string,
    categories: Category[],
    foldedCategories = [],
    foldDrawer = true
  ) {
    const container = document.getElementById(categoryContainerId)!;

    const resize = () => {
      const offset = 5;
      container.style.width = `${window.innerWidth - COMPACT_DRAWER_WIDTH + offset}px`;
      container.style.height = `${window.innerHeight - titlebar}px`;

      foldedCategories.forEach(category => {
        const el = document.getElementById(`${category}-container`)!.childNodes[0] as HTMLElement;

        el.style.height = `${window.innerHeight - titlebar}px`;
      });
    };

    if (foldDrawer) {
      let value = this.vue.$store.getters.drawerWidth;
      const id = setInterval(() => {
        value -= 16;
        const el = document.getElementById(containerId) as HTMLElement;
        el.style.gridTemplateColumns = `${value}px repeat(5, 1fr)`;
        if (value <= COMPACT_DRAWER_WIDTH) {
          const el1 = document.getElementById(containerId) as HTMLElement;
          el1.style.gridTemplateColumns = `${COMPACT_DRAWER_WIDTH}px repeat(5, 1fr)`;
          clearInterval(id);
        }
      }, 10);
    }

    resize();
    window.addEventListener("resize", resize);

    container.style.display = "grid";
    let unfoldedColumns = `repeat(${categories.length}, 1fr)`;
    if (categories.length <= 0) unfoldedColumns = "1fr";

    let foldedColumns = `repeat(${foldedCategories.length}, 50px)`;
    if (foldedCategories.length <= 0) foldedColumns = "";
    container.style.gridTemplateColumns = `${unfoldedColumns} ${foldedColumns}`;
    container.style.gridTemplateRows = "1fr";

    let index = 1;
    categories.forEach(category => {
      const parcel = document.getElementById(`${category}-container`)!;
      parcel.removeAttribute("style");
      parcel.style.gridColumn = `${index}/${index + 1}`;
      parcel.style.gridRow = "1 / 2";
      index++;
    });

    foldedCategories.forEach(category => {
      const parcel = document.getElementById(`${category}-container`)!;
      parcel.removeAttribute("style");
      parcel.style.gridColumn = `${index}/${index + 1}`;
      parcel.style.gridRow = "1 / 2";
      parcel.style.writingMode = "vertical-rl";
      parcel.style.textAlign = "center";
      parcel.style.overflow = "unset";
      index++;
    });
    window.addEventListener("resize", resize);
  }

  setupProjectsPage(containerId: string) {
    let value = COMPACT_DRAWER_WIDTH;
    const width = this.vue.$store.getters.drawerWidth;
    const id = setInterval(() => {
      value += 16;
      const el = document.getElementById(containerId) as HTMLElement;
      el.style.gridTemplateColumns = `${value}px repeat(5, 1fr)`;
      if (value >= width) {
        const el1 = document.getElementById(containerId) as HTMLElement;
        el1.style.gridTemplateColumns = `${width}px repeat(5, 1fr)`;
        clearInterval(id);
      }
    }, 10);
  }

  setupVisualizer(containerId: string, contentId: string, sideId: string) {
    const container = document.getElementById(containerId)!;
    const content = document.getElementById(contentId)!;
    const side = document.getElementById(sideId)!;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = "0px 1fr";

    content.style.gridColumn = "1 / 2";
    content.style.gridRow = "2 / 3";

    side.style.gridColumn = "1 / 2";
    side.style.gridRow = "1 / 2";
  }

  closeVisualizerSide(containerId: string, maxHeight: number) {
    const container = document.getElementById(containerId)!;
    let height = maxHeight;
    const closeId = setInterval(() => {
      height -= 32;
      container.style.gridTemplateRows = `${height}px 1fr`;
      if (height <= 0) {
        container.style.gridTemplateRows = "0px 1fr";
        clearInterval(closeId);
      }
    }, 10);
  }

  openVisualizerSide(containerId: string, maxHeight: number, callback: () => {}) {
    const container = document.getElementById(containerId)!;

    let height = 0;
    container.style.gridTemplateColumns = "1fr";
    const openId = setInterval(() => {
      height += 32;
      container.style.gridTemplateRows = `${height}px 1fr`;
      if (height >= maxHeight) {
        container.style.gridTemplateRows = `${maxHeight}px 1fr`;
        clearInterval(openId);
        callback();
      }
    }, 10);
  }
}

export default new ApplicationManager();
