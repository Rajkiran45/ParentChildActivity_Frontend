/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

// App.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Text,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import TaskCard from './components/TaskCard';
import CustomDropdown from './components/CustomDropdown';
import { Task } from './types/Task';
import messaging from '@react-native-firebase/messaging';
import { getFontSize, getResHeight, getResWidth } from './utils/response';
const App: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remainderVisible, setRemainderVisible] = useState(true);
  const [fcmToken, setFcmToken] = useState<string>('');
  const [newTask, setNewTask] = useState<Task>({ id: 0, title: '', description: '', time: new Date(), category: 'Daily Tasks', priority: 'High', fcmToken: '' });
  const [editingTask, setEditingTask] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [upcommingTask, setUpcommingTask] = useState('No Upcomming Tasks');
  const [taskData, setTaskData] = useState<Task[]>([]);
  const BASE_URL = 'https://parentchildactivity-backend.onrender.com/tasks';
  async function fetchData() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      if (data.data) {
        setTaskData(data.data);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {

      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    const taskInterval = setInterval(() => {
      const currentTime = Date.now();
      const filterTasksBasedOnTime = taskData.filter(t => {
        const time = new Date(t.time).getTime();
        if (time > currentTime) {
          return true;
        }
      });
      const mostRecentTask = filterTasksBasedOnTime.sort((t1, t2) =>
        new Date(t1.time).getTime() - new Date(t2.time).getTime()
      );
      // console.log("MOST RECENT TASKS: " + JSON.stringify(mostRecentTask))
      if (mostRecentTask.length > 0) {
        // setRemainderVisible(true);
        setUpcommingTask(mostRecentTask[0].title);
        const remainderString = new Date(mostRecentTask[0].time).getTime() - new Date(currentTime).getTime();
        const hours = Math.floor(remainderString / (1000 * 60 * 60));
        const minutes = Math.floor((remainderString % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainderString % (1000 * 60)) / 1000);
        setRemainingTime(`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} Remaining`);
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(taskInterval);
    };
  }, []);
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message Handler Background', remoteMessage);
    });
    getFCMToken();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  async function getFCMToken() {
    const token = await messaging().getToken();
    setFcmToken(token);
    console.log('FCM Token', token);
  }


  const handleAddTask = async () => {
    if (editingTask) {
      const response = await fetch(BASE_URL + `/${newTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.title,
          fcmToken: fcmToken,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category,
          time: newTask.time,
        })
      });
      const data = await response.json();
      console.log('AFTER SAVE DATA', JSON.stringify(data));
      if (data.data) {
        const copyTaskData = JSON.parse(JSON.stringify(taskData)) as Task[];
        const index = copyTaskData.findIndex(t => t.id === newTask.id);
        copyTaskData[index] = data.data;
        setTaskData(copyTaskData);
        setNewTask({ id: 0, title: '', description: '', time: new Date(), category: 'Daily Tasks', priority: 'High', fcmToken: '' });
        setEditingTask(false);
      }
    } else {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category,
          fcmToken: fcmToken,
          time: newTask.time,
        })
      });
      const data = await response.json();
      if (data.data) {
        setTaskData(prev => ([...prev, data.data]));
      }
    }

    setModalVisible(false);
  };
  const handleEditTask = async (task: Task) => {
    setEditingTask(true);
    setNewTask(task);
    setModalVisible(true);
  };
  const handleDeleteTask = async (taskId: number) => {
    const response = await
      fetch(`${BASE_URL}/${taskId}`, {
        method: 'DELETE',
      });
    if (response.status === 200) {
      setTaskData(taskData.filter(task => task.id !== taskId));
    }
  };

  const filteredTasks = taskData.filter(task => {
    const categoryMatch = filterCategory === 'All' || task.category === filterCategory;
    const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterCategoryView}>
          <Text style={styles.filterCategoryText}>Filter by category:</Text>
          <CustomDropdown
            options={['All', 'Daily Tasks', 'Routine Tasks']}
            selectedOption={filterCategory}
            handleSelectedOption={(option: string) => {
              setFilterCategory(option);
            }}
          />
        </View>
        <View style={styles.filterPriorityView}>
          <TouchableOpacity style={[styles.lowpriorityView, ({ opacity: filterPriority === 'Low' ? 1 : 0.5, })]}
            onPress={() => {
              setFilterPriority('Low');
            }}
          />
          <TouchableOpacity style={[styles.mediumpriorityView, ({ opacity: filterPriority === 'Medium' ? 1 : 0.5, })]}
            onPress={() => {
              setFilterPriority('Medium');
            }}
          />
          <TouchableOpacity style={[styles.highpriorityView, ({ opacity: filterPriority === 'High' ? 1 : 0.5, })]}
            onPress={() => {
              setFilterPriority('High');
            }}
          />
          {filterPriority !== 'All' && <TouchableOpacity style={styles.allpriorityView}
            onPress={() => {
              setFilterPriority('All');
            }}
          >
            <Text style={{
              color: 'white'
            }}>X</Text>
          </TouchableOpacity>
          }
        </View>
      </View>
      <View style={styles.dailyScheduleView}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#543310' }}>Daily Schedules</Text>
        {!remainderVisible && <TouchableOpacity onPress={() => {
          setRemainderVisible(true);
        }} ><Text style={styles.bellIcon}>🔔</Text></TouchableOpacity>}
      </View>
      {remainderVisible && <View style={{ backgroundColor: 'yellow', borderRadius: 10, marginVertical: 15, position: 'relative' }}>
        <TouchableOpacity style={{ position: 'absolute', right: -5, top: -5, paddingVertical: 2.5, paddingHorizontal: 7.5, borderRadius: 50, backgroundColor: 'red' }} onPress={() => {
          setRemainderVisible(false);
        }}><Text style={{ fontWeight: 'bold', color: '#ebebeb' }}>X</Text></TouchableOpacity>
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ color: '#000' }}>Upcoming Task</Text>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Text style={{ color: '#000' }}>{upcommingTask}</Text>
            <Text style={{ color: '#000' }}>{remainingTime}</Text>
          </View>
        </View>
      </View>}
      <FlatList
        data={filteredTasks}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onEdit={() => handleEditTask(item)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
      />

 {/* Floating Action Button to Add Activity */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#543310' }}>Add Important Task</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor={'#000'}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={'#000'}
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text style={{ color: '#000' }}>Select Time</Text>
              <Text style={{ color: '#000' }}>{new Date(newTask.time).toLocaleTimeString('in')}</Text>
            </TouchableOpacity>
            <DatePicker
              style={{ zIndex: 1 }}
              modal
              open={showDatePicker}
              date={new Date(newTask.time)}
              mode="time"
              onConfirm={(date) => {
                setShowDatePicker(false);
                setNewTask({ ...newTask, time: date });
              }}
              onCancel={() => {
                setShowDatePicker(false);
              }}
            />
            <View style={{ marginBottom: 10 }}>
              <CustomDropdown
                options={['Daily Tasks', 'Routine Tasks']}
                selectedOption={newTask.category}
                shouldGoDown
                handleSelectedOption={(value: string) => setNewTask({ ...newTask, category: value })}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <CustomDropdown
                shouldGoDown
                options={['High', 'Medium', 'Low']}
                selectedOption={newTask.priority}
                handleSelectedOption={(value) => setNewTask({ ...newTask, priority: value })}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <Button title="Save Task" onPress={handleAddTask} color={'#AF8F6F'} />
            </View>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color={'#AF8F6F'} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: getResWidth(16),
  },
  fab: {
    position: 'absolute',
    right: getResWidth(16),
    bottom: getResHeight(16),
    width: getResWidth(56),
    height: getResHeight(56),
    borderRadius: getResWidth(28),
    backgroundColor: '#74512D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: 'white',
    fontSize: getFontSize(24),
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    padding: 8,
    color: '#000',
  },
  dailyScheduleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  filterCategoryText: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterCategoryView: {
    marginRight: getResWidth(20)
  },
  filterPriorityView: {
    marginTop: getResHeight(25),
    flexDirection: 'row',
    gap: getResWidth(10),
  },
  lowpriorityView: {
    width: getResWidth(40),
    height: getResHeight(40),
    backgroundColor: '#69db7c',
    borderRadius: 6,
    paddingHorizontal: getResWidth(10),
    justifyContent: 'center',
  },
  mediumpriorityView: {
    width: getResWidth(40),
    height: getResHeight(40),
    backgroundColor: '#4dabf7',
    borderRadius: 6,
    paddingHorizontal: getResWidth(10),
    justifyContent: 'center',
  },
  highpriorityView: {
    width: getResWidth(40),
    height: getResHeight(40),
    backgroundColor: '#fa5252',
    borderRadius: 6,
    paddingHorizontal: getResWidth(10),
    justifyContent: 'center',
  },
  allpriorityView: {
    width: getResWidth(40),
    height: getResHeight(40),
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: getResWidth(10),
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 24,
    paddingHorizontal: getResWidth(10),
    paddingVertical: 7.5,
    borderRadius: 50,
    backgroundColor: '#d3d3d3'
  }
});

export default App;
