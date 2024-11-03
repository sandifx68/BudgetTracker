export interface ImgData {
  id: number;
  source: string;
}

// SVGs transformed to components with this site:
// https://react-svgr.com/playground/
export const imageData = [
  { id: 0, source: require("./img0").default },
  { id: 1, source: require("./img1").default },
  { id: 2, source: require("./img2").default },
  { id: 3, source: require("./img3").default },
];
