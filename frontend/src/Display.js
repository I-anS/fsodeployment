import React from "react";

const Display = ({ personsList, deleteHandler }) => {
  return (
    <>
      <h2>Numbers</h2>
      {personsList.map((person) => {
        return (
          <div key={person.name}>
            <p>
              {person.name} {person.number}{" "}
              <button onClick={() => deleteHandler(person.id)}>delete</button>
            </p>
          </div>
        );
      })}
    </>
  );
};

export default Display;
