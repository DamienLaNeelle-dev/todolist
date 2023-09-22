import { Image, Text } from "react-native";
import logo from "../../assets/logo.png";
import { s } from "./HeaderLogo.style";

export default function HeaderLogo() {
  return (
    <>
      <Image style={s.img} source={logo} resizeMode="contain" />
      <Text style={s.subtitle}>Tu as probablement un truc à faire</Text>
    </>
  );
}
