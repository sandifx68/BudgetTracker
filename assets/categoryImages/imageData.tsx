import { Asset } from "expo-asset";

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
const path = "./source/img";

export const imageDataSvg = [
  { id: 0, source: Asset.fromModule(require(`${path}0.svg`)).uri },
  { id: 1, source: Asset.fromModule(require(`${path}1.svg`)).uri },
  { id: 2, source: Asset.fromModule(require(`${path}2.svg`)).uri },
  { id: 3, source: Asset.fromModule(require(`${path}3.svg`)).uri },
  { id: 4, source: Asset.fromModule(require(`${path}4.svg`)).uri },
];
