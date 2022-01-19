const express = require('express')
const app = express()


// activate json parser
app.use(express.json())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.get('/', (request, response) => {
    // when clients request the main page, we send them a hello world
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    // when clients request the notes page, we send them a page with all notes in json format
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    // when clients request a specific note page, we try to find the specific note page according to its id
    // convert string to number
    const id = Number(request.params.id)
    // we try to find the note by matching the id from client with the id from our server that contains the note
    const note = notes.find(note => {
        return note.id === id
    })
    if (note) {
        // we end them a page with the specific note in json format
        response.json(note)
    } else {
        //e.g. out of length, set code to 404, end without sending any data        
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})


const generateId = () => {
    const maxId = notes.length > 0
        // map creates a copy of every single note, but we need to find the max, so we use ... to break it down
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    // if content is empty, we won't let it add to the server
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        // = body.important if body.important has a value. Otherwise = false
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})