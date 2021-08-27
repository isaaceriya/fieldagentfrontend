import React from "react";

function Input({ changeHandler, value }) {
  return (
    <div>
      <label className="sr-only" htmlFor="add-todo">
        Add Todo
      </label>
      <input id="add-todo" type="text" onChange={changeHandler} value={value} />
    </div>
  );
}

export default Input;
