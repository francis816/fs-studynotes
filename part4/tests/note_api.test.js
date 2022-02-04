const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')


beforeEach(async () => {
    await Note.deleteMany({})

    for (let note of helper.initialNotes) {
        let noteObject = new Note(note)
        await noteObject.save()
    }
})

describe('when there is initially some notes save', () => {
    test('notes are returned as json', async () => {
        console.log('entered test')
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        // execution gets here only after the HTTP request is complete
        // the result of HTTP request is saved in variable response
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })

    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)
        expect(contents).toContain(
            'Browser can execute only Javascript'
        )
    })
})


describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        // fetch a note from the database.
        const notesAtStart = await helper.notesInDb()

        const noteToView = notesAtStart[0]

        // call the actual operation being tested according to the id of the note fetched from the database
        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // verify that the outcome of the operation is as expected
        const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

        expect(resultNote.body).toEqual(processedNoteToView)
    })
    test('fails with statuscode 404 if note does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        console.log(validNonexistingId)

        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})


describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

        const contents = notesAtEnd.map(n => n.content)
        expect(contents).toContain(
            'async/await simplifies making async calls'
        )
    })

    test('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

    })
})


describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        // fetch a note from the database.
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        // call the actual operation being tested according to the id of the note fetched from the database
        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        // verify that the outcome of the operation is as expected
        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(
            helper.initialNotes.length - 1
        )

        const contents = notesAtEnd.map(r => r.content)

        expect(contents).not.toContain(noteToDelete.content)
    })
})




afterAll(() => {
    mongoose.connection.close()
})

