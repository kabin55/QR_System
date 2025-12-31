import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_Web_SocketFrontend_URL

export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
})

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id)
})

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected')
})

socket.on('connect_error', (err) => {
  console.error('Socket error:', err.message)
})
