/* eslint-disable prettier/prettier */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.card, {
      backgroundColor:task.priority === 'Medium' ? '#4dabf775' : task.priority === 'High' ? '#fa525275' : '#69db7c75',
    }]}>
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.textView}>
      <Text style={styles.textBold}>Description: </Text>
      <Text style={styles.textregular}>{`${(task.description)}`}</Text>
      </View>
      <View style={styles.textView}>
      <Text style={styles.textBold}>Time: </Text>
      <Text style={styles.textregular}>{`${new Date(task.time).toLocaleTimeString('in')}`}</Text>
      </View>
      <View style={styles.textView}>
      <Text style={styles.textBold}>Category </Text>
      <Text style={styles.textregular}>{`${(task.category)}`}</Text>
      </View>
      <View style={styles.textView}>
      <Text style={styles.textBold}>Priority </Text>
      <Text style={styles.textregular}>{`${(task.priority)}`}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <Text style={styles.textButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <Text style={styles.textButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {

    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#000',
  },
  textView:{
    flexDirection:'row',
  },
  textBold:{
    fontSize:16,
    fontWeight:'bold',
    color: '#000',
  },
  textregular:{
    fontSize:14,
    color: '#000',
  },
  textButton:{
    fontSize:14,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 16,
    gap:20,
  },
  button: {
    backgroundColor: '#AF8F6F',
    padding: 8,
    borderRadius: 4,
  },
});

export default TaskCard;
