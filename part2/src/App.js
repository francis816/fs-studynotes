import React, { useState } from 'react'
import Note from './components/Note'


const App = (props) => {
  const [allNotes, setAllNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()
    //event = the mouse click
    // event.target = the HTML form tag

    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: allNotes.length + 1,
    }

    setAllNotes(allNotes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    // event = an obj that contains a lot of properties, e.g. the key you pressed
    // event.target = the HTML input tag
    // event.target.value = the value attribute inside the HTML input tag, e.g. the key you pressed
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    // same as showAll? allNotes : allNotes.filter...
    // if showAll = true, return allNotes, else return allNotes.filter...
    ? allNotes
    : allNotes.filter(note => note.important === true)

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
        {notesToShow.map(note =>
          <Note key={note.id} content={note.content} />
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