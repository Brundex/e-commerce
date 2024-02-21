import express from 'express'
import cartRouter from './routes/cartRouter.js'
import productsRouter from './routes/productsRouter.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


//conexion a socket.io vista en clase
io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('movimiento', info => { 
        console.log(info)
    })

    socket.on('rendirse', info => { 
        console.log(info)
        socket.emit('mensaje-jugador', "Te has rendido") 
        socket.broadcast.emit('rendicion', "El jugador se rindio") 
    })

})

app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)


