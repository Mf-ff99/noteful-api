import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';
import NotefulContext from '../NotefulContext'
import Note from '../Note/Note';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        // fake date loading from API call
        Promise.all([
            fetch(`http://localhost:9090/notes`),
            fetch(`http://localhost:9090/folders`)
        ])
        .then(([noteResponse, folderResponse]) => {
            if(!noteResponse.ok)
                return noteResponse.json().then(event => Promise.reject(event))
            if(!folderResponse.ok)
                return folderResponse.json().then(event => Promise.reject(event))
            return Promise.all([noteResponse.json(), folderResponse.json()])
        })
        .then(([notes, folders]) => {
            this.setState({
                notes, folders
            })
        }).catch((e) => {
            console.log(e.message);
        })
    }

    renderNavRoutes() {
        return (
            <> 
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact 
                        key={path}
                        path={path}
                       component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageNav}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        // const {notes} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                                />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                />
            </>
        );
    }

   handleRemove = noteId => {
    const newNotes = this.state.notes.filter(note => note.id !== noteId)    
     console.log(newNotes)

        fetch(`http://localhost:9090/notes/${noteId}`, {
            method: 'DELETE', 
            headers: {'content-type': 'application/json'}
        })
        .then(res => {
            if(!res.ok)
                return res.json().then(event => Promise.reject(event))
            else    
                return res.json();
        })


    this.setState({
           notes: newNotes
       })
   }
    
    render() {
        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            handleRemove: this.handleRemove
        }
        return (
            <div className="App">
                <NotefulContext.Provider value={contextValue}>
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
                </NotefulContext.Provider>
            </div>
        );
    }
}

export default App;
