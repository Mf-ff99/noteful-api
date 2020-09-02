import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import NotefulContext from '../NotefulContext'
import { findNote } from '../notes-helpers'

export default function NotePageMain(props) {
  return (
    <section className='NotePageMain'>
    <NotefulContext.Consumer>
      {({notes}) => {
      const {noteId} = props.match.params
      const note = findNote(notes, noteId)
      function handleRedirect(){
        props.history.push(`/`)
      }
      return ( 
      <>
      <Note
        id={note.id}
        name={note.name}
        modified={note.modified}
        redirect={handleRedirect}
      />
       <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
      </>
      )
        }}
      </NotefulContext.Consumer>
    </section>
      )
}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}
