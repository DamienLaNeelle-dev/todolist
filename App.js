import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { s } from "./App.style";
import HeaderLogo from "./components/HeaderLogo/HeaderLogo";
import Cards from "./components/Cards/Cards";
import { useEffect, useState } from "react";
import FooterMenu from "./components/FooterMenu/FooterMenu";
import AddButton from "./components/AddButton/AddButton";
import Dialog from "react-native-dialog";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

let isFirstRender = true;
let isLoadUpdate = false;

export default function App() {
  const [selectedFooterMenu, setSelectedFooterMenu] = useState("all");
  const [todoList, setTodoList] = useState([]);
  const [isAddDialogVisibile, setIsAddDialogVisibile] = useState();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    loadTodoList();
  }, []);

  useEffect(() => {
    if (isLoadUpdate) {
      isLoadUpdate = false;
    } else {
      if (!isFirstRender) {
        saveTodoList();
      } else {
        isFirstRender = false;
      }
    }
  }, [todoList]);

  async function saveTodoList() {
    try {
      await AsyncStorage.setItem("@todoList", JSON.stringify(todoList));
    } catch (error) {
      alert("Erreur " + error);
    }
  }
  async function loadTodoList() {
    try {
      const stringifiedTodoList = await AsyncStorage.getItem("@todoList");
      if (stringifiedTodoList != null) {
        const parsedTodoList = JSON.parse(stringifiedTodoList);
        isLoadUpdate = true;
        setTodoList(parsedTodoList);
      }
    } catch (error) {
      alert("Erreur " + error);
    }
  }
  function getFiltredList() {
    switch (selectedFooterMenu) {
      case "all":
        return todoList;
      case "inProgress":
        return todoList.filter((todo) => !todo.isCompleted);
      case "done":
        return todoList.filter((todo) => todo.isCompleted);
    }
  }
  function updateTodo(todo) {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    const indexToUpdate = todoList.findIndex(
      (todo) => todo.id === updatedTodo.id
    );

    const updatedTodoList = [...todoList];
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }

  function deleteTodo(todoToDelete) {
    Alert.alert("Suppression", "Supprimer cette tâche?", [
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          setTodoList(todoList.filter((todo) => todo.id != todoToDelete.id));
        },
      },
      {
        text: "Annuler",
        style: "cancel",
      },
    ]);
  }

  function renderTodoList() {
    return getFiltredList().map((todo) => (
      <View style={s.cardItem} key={todo.id}>
        <Cards onLongPress={deleteTodo} onPress={updateTodo} todo={todo} />
      </View>
    ));
  }

  function showAddDialog() {
    setIsAddDialogVisibile(true);
  }

  function addTodo() {
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };

    setTodoList([...todoList, newTodo]);
    setIsAddDialogVisibile(false);
  }
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <HeaderLogo />
          </View>
          <View style={s.body}>
            <ScrollView>{renderTodoList()}</ScrollView>
          </View>
          <AddButton onPress={showAddDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <FooterMenu
          todoList={todoList}
          onPress={setSelectedFooterMenu}
          selectedFooterMenu={selectedFooterMenu}
        />
      </View>
      <Dialog.Container
        visible={isAddDialogVisibile}
        onBackdropPress={() => setIsAddDialogVisibile(false)}
      >
        <Dialog.Title>Créer une tâche</Dialog.Title>
        <Dialog.Description>
          Choisi un nom pour la nouvelle tâche
        </Dialog.Description>
        <Dialog.Input onChangeText={setInputValue} />
        <Dialog.Button
          disabled={inputValue.trim().length === 0}
          label="Créer"
          onPress={addTodo}
        />
      </Dialog.Container>
    </>
  );
}
