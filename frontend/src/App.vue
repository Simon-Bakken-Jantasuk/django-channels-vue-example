<script setup>
import { ref } from 'vue';

let roomName = '';
let socket = null;
const message = ref('');
const messages = ref([]);
const isConnected = ref(false);

const joinGroup = () => {
  const newUrl = `ws://127.0.0.1:8000/ws/chat/${roomName}/`;
  if (socket && socket.url === newUrl) {
    console.log(`Already connected to /ws/chat/${roomName}`);
    return; 
  };

  if (socket) {
    socket.close();
    messages.value = [];
  };

  socket = new WebSocket(newUrl);

  socket.onopen = function(e) {
    console.log(`Connected to /ws/chat/${roomName}`);
    isConnected.value = true;
  };

  socket.onclose = function(e) {
    console.log('WebSocket connection closed:', e);
    isConnected.value = false;
  };

  socket.onerror = function(e) {
    console.error('WebSocket error:', e);
  };

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    messages.value.push(data.message);
  };
};

const sendMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message: message.value }));
    message.value = '';
  } else {
    console.error('WebSocket is not open.');
  }
};
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
    <input type="text" :value="roomName" @input="roomName = $event.target.value" placeholder="Enter room name"/>
    <button @click="joinGroup">Join</button>
  </div>
  <div class="messageForm">
    <input type="text" v-model="message" placeholder="Enter message" @keyup.enter="sendMessage"/>
    <button @click="sendMessage">Send (or click enter)</button>
  </div>
</template>
