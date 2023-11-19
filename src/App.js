import React, { Component } from "react";
import Header from "./Header";
import NotesList from "./NotesList";

//Inside of App‘s state, you’ll add the data
//in the notes property as an array of objects

//Below the notes property in App‘s state, add a
//searchText property of state as a string data value.
class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true
      }
    ],
    searchText: ""
  };

  addNote = () => {
    //create a new note
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true
    };

    //add a new note to existing notes array in state
    this.setState({ notes: [newNote, ...this.state.notes] });
    //or in two steps
    //const newNotes = [newNote, ...this.state.notes];
    //this.setState({ notes: newNotes });
  };

  //define an onType event handler method that copies the array of
  //notes currently in state, keeping all note objects the same except
  //for the object matching the id of the note that the user typed in.
  //The object with the matching id should be copied, updating the
  //string value of the edited property.
  //Use props to pass a reference to the onType method
  //from App to each Note component.
  onType = (editMeId, updatedKey, updatedValue) => {
    //editMeId = id of the note that is edited
    //updatedKey = title or description field
    //updatedValue = value of title or description
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== editMeId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });
    this.setState({ notes: updatedNotes });
  };

  //define an onSearch method that maps over the notes array and for each note object.
  onSearch = (text) => {
    const newSearchText = text.toLowerCase();
    const updatedNotes = this.state.notes.map((note) => {
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        // if (titleMatch) {
        //   note.doesMatchSearch = true;
        // } else if (descriptionMatch) {
        //   note.doesMatchSearch = true;
        // } else {
        //   note.doesMatchSearch = false;
        // }
        //little cleaner version here:
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
      }
    });
    //update state
    this.setState({
      notes: updatedNotes,
      searchText: newSearchText
    });
  };

  removeNote = (noteId) => {
    const updatedNotes = this.state.notes.filter((note) => note.id !== noteId);
    this.setState({ notes: updatedNotes });
  };

  //two lifecycle functions - add save functionality to the UI.
  //To do this, think about what data needs to be saved to the browser’s
  //localStorage, and when in the components’ lifecycles we should
  //write to and read from localStorage.
  componentDidUpdate() {
    const stringifiedNotes = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", stringifiedNotes);
  }
  //if there is anything saved in the local storage, then lets bring that up
  componentDidMount() {
    const stringifiedNotes = localStorage.getItem("savedNotes");
    if (stringifiedNotes) {
      const savedNotes = JSON.parse(stringifiedNotes);
      this.setState({ notes: savedNotes });
    }
  }

  //passing props down to the compnonents that need them
  //Set the value attribute of the text input element in Header
  render() {
    return (
      <div>
        <Header
          onSearch={this.onSearch}
          addNote={this.addNote}
          searchText={this.state.searchText}
        />
        <NotesList
          removeNote={this.removeNote}
          onType={this.onType}
          notes={this.state.notes}
        />
      </div>
    );
  }
}

export default App;
