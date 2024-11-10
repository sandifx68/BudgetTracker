import { Asset } from "expo-asset";

export interface ImgData {
  id: number;
  source: string;
}

const path = "./source/img";

export const imageDataSvg: ImgData[] = [
  { id: 0, source: Asset.fromModule(require(`${path}0.svg`)).uri },
  { id: 1, source: Asset.fromModule(require(`${path}1.svg`)).uri },
  { id: 2, source: Asset.fromModule(require(`${path}2.svg`)).uri },
  { id: 3, source: Asset.fromModule(require(`${path}3.svg`)).uri },
  { id: 4, source: Asset.fromModule(require(`${path}4.svg`)).uri },
  { id: 5, source: Asset.fromModule(require(`${path}5.svg`)).uri },
  { id: 6, source: Asset.fromModule(require(`${path}6.svg`)).uri },
  { id: 7, source: Asset.fromModule(require(`${path}7.svg`)).uri },
  { id: 8, source: Asset.fromModule(require(`${path}8.svg`)).uri },
  { id: 9, source: Asset.fromModule(require(`${path}9.svg`)).uri },
  { id: 10, source: Asset.fromModule(require(`${path}10.svg`)).uri },
  { id: 11, source: Asset.fromModule(require(`${path}11.svg`)).uri },
  { id: 12, source: Asset.fromModule(require(`${path}12.svg`)).uri },
  { id: 13, source: Asset.fromModule(require(`${path}13.svg`)).uri },
  { id: 14, source: Asset.fromModule(require(`${path}14.svg`)).uri },
];
