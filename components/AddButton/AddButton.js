import { Text, TouchableOpacity } from "react-native";
import { s } from "./AddButton.style";

export default function ButtonAdd({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.btn}>
      <Text style={s.txt}>Nouvelle tâche</Text>
    </TouchableOpacity>
  );
}
