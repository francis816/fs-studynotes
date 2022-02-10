import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'
import { set } from 'mongoose'


const Footer = () => {
  const footerStyle = {
    color: 'springgreen',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2021</em>
    </div>
  )
}


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened ...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


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


  // if found user from localstorage, we set user and token right away 
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


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
        setErrorMessage(
          `Note '${note.content}' was already deleted from server`
        )
        // set the errorMessage state to null after five seconds.
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // filter out the note that's not existed in the server
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>
  )
  return (
    <>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }
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
      <Footer />
    </>
  )
}

export default App