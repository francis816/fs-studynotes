import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    // changed axios to noteService, bc we now import from noteService
    noteService
      .getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        setNotes(initialNotes)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }
    // changed axios to noteService, bc we now import from noteService
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    // event = an obj that contains a lot of properties, e.g. the key you pressed
    // event.target = the HTML input tag
    // event.target.value = the value attribute inside the HTML input tag, e.g. the key you pressed
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = (id) => {
    const url = `http:localhost:3001/notes/${id}`
    // find the note whose id matches id param
    const note = notes.find(n => n.id === id)
    // copy the note, except its 'important' prperty, we will toggle it instead
    const changedNote = { ...note, important: !note.important }
    // use put method to modify entire array
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        // loop through each note, if note id doesn't match id param, aka not the note we want, we just copy the old version
        // if we find the note we want, we changed note info according to server's data, aka update 'important' property
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `note note '${note.content}' was already deleted from server`
        )
        // filter out the note that's not existed in the server
        setNotes(notes.filter(n => n.id !== id))
      })
  }


  return (
    <>
      <h1>Notes</h1>
      <>
        {/*The event handler switches the value of showAll from true to false and vice versa: */}
        <button onClick={() => setShowAll(!showAll)}>
          {/* if showAll = true, button text = "show important" (so you can click to show just the importants), else ="show all" */}
          show {showAll ? 'important' : 'all'}
        </button>
      </>
      <ul>
        {notesToShow.map((note, i) =>
          <Note key={i} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        {/* we don't have to have value={newNote} below, it is just default "a new note ..." at the begining */}
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </>
  )
}

export default App