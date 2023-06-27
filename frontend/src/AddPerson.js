import React from "react";

const AddPerson = ({
  submitHandler,
  nameValue,
  nameHandler,
  numberValue,
  numberHandler,
}) => {
  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={submitHandler}>
        <div>
          name: <input value={nameValue} onChange={nameHandler} />
        </div>
        <div>
          number: <input value={numberValue} onChange={numberHandler} />
        </div>
        <div>
          <button style={{ backgroundColor: "lightBlue" }} type="submit">
            add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPerson;
