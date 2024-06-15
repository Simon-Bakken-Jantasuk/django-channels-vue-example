<script setup>
import { ref, watch } from 'vue';
import Socket from '@/utils/socket'; 

let roomName = '';
let socket = null;
const message = ref('');
const messages = ref([]);
const isConnected = ref(false);

const joinGroup = () => {
  const newUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/`;

  const callback = {
    onOpen: () => isConnected.value = true,
    onClose: () => isConnected.value = false,
    onError: () => isConnected.value = false,
  };

  socket = new Socket(newUrl, callback); 

  socket.connect();

  socket.on(roomName, ({ message }) => {
    messages.value.push(message);
  });
}

const sendMessage = () => {
  if (socket) {
    socket.emit(roomName, { message: message.value });
    message.value = '';
  };
}
</script>

<template>
  <div class="statusBar">
    <h1 v-if="isConnected">You have joined the "{{ roomName }}" chat</h1>
    <h1 v-else>You are not connected to any websocket</h1>
  </div>
  <div class="chatLog">
    <ul>
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
  </div>
  <div class="roomForm">
    <input type="text" v-model="roomName" placeholder="Enter room name" @keyup.enter="joinGroup"/>
    <button @click="joinGroup">Join</button>
  </div>
  <div class="messageForm">
    <input type="text" v-model="message" placeholder="Enter message" @keyup.enter="sendMessage"/>
    <button @click="sendMessage">Send (or click enter)</button>
  </div>
</template>
