import { WebSocketServer, WebSocket } from 'ws'

type MessageHandler = (client: WebSocket, message: string) => void
type ConnectionHandler = (client: WebSocket) => void

class WsServer {
    private wss: WebSocketServer
    private clients = new Set<WebSocket>()

    private onMessageHandler?: MessageHandler
    private onConnectionHandler?: ConnectionHandler

    constructor(private port = 3001) {
        this.wss = new WebSocketServer({ port: this.port })
    }

    start() {
        this.wss.on('connection', (socket: WebSocket) => {
            this.clients.add(socket)

            console.log('Client connected')

            this.onConnectionHandler?.(socket)

            socket.on('message', (data) => {
                console.log('Received message:', data.toString())

                const message = data.toString()
                this.onMessageHandler?.(socket, message)
            })

            socket.on('close', () => {
                this.clients.delete(socket)
                console.log('Client disconnected')
            })

            socket.on('error', (err) => {
                console.error('Socket error:', err)
            })
        })

        console.log(`WS server started on ws://localhost:${this.port}`)
    }

    onMessage(handler: MessageHandler) {
        this.onMessageHandler = handler
    }

    onConnection(handler: ConnectionHandler) {
        this.onConnectionHandler = handler
    }

    send(client: WebSocket, data: unknown) {
        client.send(JSON.stringify(data))
    }

    broadcast(data: unknown) {
        const payload = JSON.stringify(data)

        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload)
            }
        }
    }

    stop() {
        this.wss.close()
        this.clients.clear()
    }
}

const wsServer = new WsServer(3001)

export { wsServer }
