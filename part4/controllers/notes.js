const notesRouter = require('express').Router()
const { findByIdAndRemove } = require('../models/note')
const Note = require('../models/note')


notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    // try {
    //     const note = await Note.findById(request.params.id)
    //     if (note) {
    //         response.json(note)
    //     } else {
    //         response.status(404).end()
    //     }
    // } catch (exception) {
    //     next(exception)
    // }

    // same as above thanks to the library
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
    // bc of the express-async-errors library, we don't need try and catch and next function anymore
})


notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).end()
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    // try {
    //     const savedNote = await note.save()
    //     response.json(savedNote)
    // } catch (exception) {
    //     next(exception)
    // }

    // same as above thanks to the async error library
    const savedNote = await note.save()
    response.status(201).json(savedNote)

})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    
    //By default, the updatedNote parameter of the event handler receives the original document without the modifications. 
    //We added the optional { new: true }parameter, which will cause our event handler to be called with the new modified document instead of the original.
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter
