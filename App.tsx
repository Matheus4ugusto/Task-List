import { StatusBar } from "expo-status-bar";
import {useEffect, useState} from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

interface Task {
  name: string;
  isCompleted: boolean
}

const TASK_KEY = '@tasks';

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTaskIndex, setEditTaskIndex] = useState<number>(-1);

  useEffect(() => {
    AsyncStorage.getItem(TASK_KEY).then((data) => {
      if(data){
        setTasks(JSON.parse(data))
      }
    })
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks))
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim()) {
      if (editTaskIndex > -1) {
        const newTasks = [...tasks];
        newTasks[editTaskIndex] = {name: task, isCompleted: false};
        setTasks(newTasks);
        setEditTaskIndex(-1);
      } else {
        setTasks([...tasks, {name: task, isCompleted: false}]);
      }
      setTask("");
    }
  };

  const handleEditTask = (index: number) => {
    const taskToEdit = tasks[index].name;
    setTask(taskToEdit);
    setEditTaskIndex(index);
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleToggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    setTasks(updatedTasks)
  }

  const renderItem = ({ item, index }: { item: Task; index: number }) => (
    <View style={{...styles.task, backgroundColor: item.isCompleted ? "#d7d7d7" : "#f5f5f5"}}>
      <View style={{flexDirection: "row", gap: 5}}>
        <TouchableOpacity onPress={() => handleToggleTask(index)}>
          <Icon name={item.isCompleted ? "check-circle" : "circle-thin"}
                size={20}
                color="#01de1b"
          />
        </TouchableOpacity>
        <Text>{item.name}</Text>
      </View>

      <View style={styles.tasksButtons}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Icon name="edit" size={20} color="#03b4d7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Lista de tarefas</Text>
      <Text>Adicione tarefas</Text>
      <TextInput
        style={styles.input}
        value={task}
        placeholder="Adicionar tarefa"
        onChangeText={(text) => setTask(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>
          {editTaskIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    color: "#03b4d7",
    fontWeight: "bold",
  },
  buttonBox: {
    flexDirection: "row",
    gap: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  addButton: {
    backgroundColor: "#03b4d7",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },
  tasksButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  editButton: {
    marginRight: 10,
    color: "#03b4d7",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});
