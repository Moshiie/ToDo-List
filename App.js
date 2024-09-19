import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { width } = Dimensions.get('window');

  const handleAddTask = () => {
    if (task.trim().length === 0) {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }

    if (isEditing !== null) {
      setTasks(
        tasks.map((item) =>
          item.key === isEditing ? { ...item, task } : item
        )
      );
      setIsEditing(null);
    } else {
      setTasks([...tasks, { key: Math.random().toString(), task, date: new Date().toDateString() }]);
    }
    setTask('');
    setModalVisible(false); // Close modal after saving
  };

  const handleEditTask = (taskKey) => {
    const selectedTask = tasks.find((item) => item.key === taskKey);
    if (selectedTask) {
      setTask(selectedTask.task);
      setIsEditing(taskKey);
      setModalVisible(true); // Open modal for editing
    }
  };

  const handleDeleteTask = (taskKey) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter((item) => item.key !== taskKey)),
        },
      ],
      { cancelable: true }
    );
  };

  const filteredTasks = tasks.filter((item) =>
    item.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const noResults = searchQuery.length > 0 && filteredTasks.length === 0;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>To Do List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search your tasks"
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Tasks Section */}
      <View style={styles.notesSection}>
        {noResults ? (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No task found</Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>There are no tasks yet</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <View style={styles.taskContent}>
                  <Text style={styles.taskText}>{item.task}</Text>
                  <Text style={styles.taskDate}>{item.date}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => handleEditTask(item.key)} style={styles.editButton}>
                    <Ionicons name="pencil" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTask(item.key)} style={styles.deleteButton}>
                    <Ionicons name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.flatListContent} // Apply styles to FlatList container
          />
        )}
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { width: width * 0.15, height: width * 0.15, borderRadius: (width * 0.15) / 2 }]}
        onPress={() => {
          setTask('');
          setIsEditing(null);
          setModalVisible(true); // Open modal for adding a new task
        }}
      >
        <Ionicons name="add" size={width * 0.08} color="white" />
      </TouchableOpacity>

      {/* Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder={isEditing ? "Edit your task" : "Add your task"}
              placeholderTextColor="#ccc"
              value={task}
              onChangeText={(text) => setTask(text)}
              onSubmitEditing={handleAddTask}
              autoFocus
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={handleAddTask} style={styles.modalButton}>
                <Ionicons name="checkmark" size={24} color="white" />
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
                <Ionicons name="close" size={24} color="white" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#1F1F1F',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  notesSection: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between', // Align items with space between
    flexWrap: 'wrap', // Allow wrapping
  },
  flatListContent: {
    paddingHorizontal: 0, // Adjust padding as needed
  },
  taskCard: {
    backgroundColor: '#2b2b2d',
    padding: 15,
    borderRadius: 12,
    width: '48%', // Slightly less than 50% to account for margin
    aspectRatio: 1, // Ensures a square shape for the cards
    marginBottom: 20, // Increased bottom margin for more space between rows
    marginHorizontal: '1%', // Space between cards horizontally
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0f0f0',
  },
  taskDate: {
    color: '#888',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 10,
  },
  editButton: {
    backgroundColor: '#FFB74D',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#EF5350',
    padding: 8,
    borderRadius: 8,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#2b2b2d',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  noTasksText: {
    color: '#ccc',
    fontSize: 18,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#EF5350',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
