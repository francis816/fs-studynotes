import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Axios from 'axios'
import axios from 'axios'

const App = () => {
  const [allNotes, setAllNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)

  // run the funtion below, it will print 'render 0 notes' b4 'effect', 'promise fulfilled', 'render 3 notes'
  // bc it takes time to fetch data
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        // note = response.data, note.content = response.data.content
        // response is the obj we got back from server
        // a call to the state-updating function -> trggiers the re-rendering of the component
        setAllNotes(response.data)
      })
    // by default, effect runs after every render.
    // E.g. you have an onclick event button and an effect function to console log something
    // every time you click the button (render), it will console log everytime
  }, [])

  console.log('render', allNotes.length, 'notes')

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