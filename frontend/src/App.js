import { useState, useEffect } from "react";
import Filter from "./Filter";
import AddPerson from "./AddPerson";
import Display from "./Display";
import personService from "./services/Persons";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState();
  const [notifMessage, setNotifMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => setPersons(response));
    // axios.get("http://localhost:3001/persons").then((response) => {
    //   const persons = response.data;
    //   setPersons(response.data);
    // });
  }, []);

  const displayNotif = (message) => {
    setNotifMessage(message);
    setTimeout(() => {
      setNotifMessage(null);
    }, 5000);
  };

  const addName = (event) => {
    event.preventDefault();
    const personObj = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    if (
      persons.some(
        (person) => person.name === newName && person.number === newNumber
      )
    ) {
      alert(`${newName} is already added to phone book`);
    } else if (
      persons.some(
        (person) => person.name === newName && person.number !== newNumber
      )
    ) {
      const shouldProceed = window.confirm(
        `${newName} is already added to phone book, replace the old number with new one?`
      );
      if (shouldProceed) {
        const existingPerson = persons.find(
          (person) => person.name === newName
        );
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(updatedPerson.id, updatedPerson)
          .then((response) => {
            // console.log(response);
            // response contains the newObject
            setPersons(
              persons.map((person) =>
                // If the id to be changed matches, update with new object
                person.id === existingPerson.id ? response : person
              )
            );
            displayNotif(`Added ${updatedPerson.name}`);
          })
          .catch((error) => {
            displayNotif(
              `Information of ${updatedPerson.name} has already been removed from server`
            );
            setPersons(persons.filter((n) => n.id !== updatedPerson.id));
          });
      }
    } else if (persons.some((person) => person.number === newNumber)) {
      alert(`${newNumber} is already added to phone book`);
    } else {
      personService.create(personObj).then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
        displayNotif(`Added ${response.name}`);
      });
      // axios
      //   .post("http://localhost:3001/persons", personObj)
      //   .then((response) => {
      //     setPersons(persons.concat(personObj));
      //     setNewName("");
      //     setNewNumber("");
      //   });
    }
  };

  const deleteName = (id) => {
    const person = persons.find((n) => n.id === id);
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        displayNotif(`Removed ${person.name}`);
        // setPersons(persons.filter((person) => person.id !== id));
        // const arr = persons.filter((obj) => obj.id !== response.id);
        // setPersons(arr);
        // The problem occurs when trying to filter the persons array based on the id of the response. In this case, the response object is the response data returned by the personService.remove() function, which is typically the HTTP response data and not the deleted person's data.
      })
      .catch((error) => {
        displayNotif(
          `Information of ${person.name} has already been removed from server`
        );
        setPersons(persons.filter((n) => n.id !== person.id));
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = !filter
    ? persons
    : persons.filter(
        (person) => person.name.toLowerCase() === filter.toLowerCase()
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} />
      <Filter filterHandler={handleFilterChange} />
      {/* <div>
        filter shown with <input onChange={handleFilterChange} />
      </div> */}
      <AddPerson
        submitHandler={addName}
        nameValue={newName}
        nameHandler={handleNameChange}
        numberValue={newNumber}
        numberHandler={handleNumberChange}
      />
      {/* <h2>Add a new</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form> */}
      <Display personsList={personsToShow} deleteHandler={deleteName} />
      {/* Key required for optimal changing on the part of React */}
      {/* {personsToShow.map((person) => {
        return (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
        );
      })} */}
    </div>
  );
};

export default App;

// Learning Points:
// Maps need to return
// Use Key to improve re-rendering optimisation in React
