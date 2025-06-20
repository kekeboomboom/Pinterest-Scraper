'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import type { WebSocketMessage } from '@/types/pinterest'

interface ProvidersProps {
  children: ReactNode
}

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  lastMessage: WebSocketMessage | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  lastMessage: null,
})

export const useWebSocket = () => useContext(WebSocketContext)

export function Providers({ children }: ProvidersProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      path: '/api/socket',
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      console.log('WebSocket connected')
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    })

    socketInstance.on('job-update', (message: WebSocketMessage) => {
      setLastMessage(message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}