import * as React from "react";
import { ActivityIndicator } from "react-native";
import Svg, { SvgUri } from "react-native-svg";
import { SvgCssUri } from "react-native-svg/css";
import * as DB from "../controllers/database/DatabaseController";
import { imageDataSvg } from "../assets/categoryImages/imageData";

export default () => {
  const [loading, setLoading] = React.useState(true);
  const [imageUris, setImageUris] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      await DB.downloadImages(imageDataSvg);
      const imageUris = await DB.getImageUris();
      setImageUris(imageUris);
    };
    fetchImage().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size={"large"}></ActivityIndicator>;
  }

  return (
    <Svg>
      <SvgUri fill={"#FFFF00"} stroke={"#000000"} width="100%" height="100%" uri={imageUris[0]} />
    </Svg>
  );
};
