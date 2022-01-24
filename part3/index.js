require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
// so Note = module.exports = mongoose.model("Note", noteSchema)
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};


app.use(express.static('build'))
// able to deal with different origin. e.g. frontend react = 3000, backend = 3001
app.use(cors())
// activate json parser
app.use(express.json())
app.use(requestLogger);

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
    // fetch all notes from db instead of server
    Note.find({}).then(notes => {
        response.json(notes)
    })

})

app.get('/api/notes/:id', (request, response, next) => {
    // now we connect to db, Mongoose's findById method
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/notes/:id', (request, response) => {
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)
    // response.status(204).end()

    // connect to db
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
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

    // add to Note in db rather than server
    const note = new Note({
        content: body.content,
        // = body.important if body.important has a value. Otherwise = false
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    })
    //The note objects are created with the Note constructor function. The response is sent inside of the callback function for the save operation. 
    //This ensures that the response is sent only if the operation succeeded. 
    note.save().then(savedNote => {
        response.json(note)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    //  By default, the updatedNote parameter of the event handler receives the original document without the modifications.
    //  We added the optional { new: true } parameter, which will cause our event handler to be called with the new modified document instead of the original.
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === "CastError") {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)

// dynamic port for Heroku or according to .env flie, otherwise 3001 if former is not defined
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})