import { Image, Text, TouchableOpacity } from "react-native";
import { s } from "./Cards.style";
import checkLogo from "../../assets/check.png";

export default function Cards({ todo, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(todo)}
      onPress={() => onPress(todo)}
      style={s.card}
    >
      <Text
        style={[
          s.text,
          todo.isCompleted && { textDecorationLine: "line-through" },
        ]}
      >
        {todo.title}
      </Text>
      {todo.isCompleted && <Image source={checkLogo} style={s.img} />}
    </TouchableOpacity>
  );
}
