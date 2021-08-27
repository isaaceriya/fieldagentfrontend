import React from "react";
import "./App.css";
import Input from "./components/Input";
import api from "./services/api.js";

function App() {
  // Are we updating?
  const [id2Edit, setId2Edit] = React.useState(null);

  // This is used to control the child component
  const [middleNameValue, setMiddleNameValue] = React.useState("");
  const [lastNameValue, setLastNameValue] = React.useState("");
  const [dobValue, setDobValue] = React.useState("");
  const [heightInInchesValue, setHeightInInchesValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState(""); // First name

  // Array destructuring
  const [todos, setTodos] = React.useState([]);

  React.useEffect(
    () => {
      api
        .index()
        .then((todos) => {
          setTodos(todos);
        })
        .catch(() => {
          console.error("Some other error when fetching all the stuff");
        });
    },

    // Dependency array
    // Empty means only run this `useEffect` once
    []
  );

  const handleChange = (e) => {
    // As we type in the input, we want to update the state
    // This will updated the controlled Input component
    setInputValue(e.target.value);
  };

  const handleMiddleChange = (e) => {
    // As we type in the input, we want to update the state
    // This will updated the controlled Input component
    setMiddleNameValue(e.target.value);
  };

  const handleLastChange = (e) => {
    // As we type in the input, we want to update the state
    // This will updated the controlled Input component
    setLastNameValue(e.target.value);
  };

  const handleDobChange = (e) => {
    // As we type in the input, we want to update the state
    // This will updated the controlled Input component
    setDobValue(e.target.value);
  };

  const handleHeightChange = (e) => {
    // As we type in the input, we want to update the state
    // This will updated the controlled Input component
    setHeightInInchesValue(e.target.value);
  };

  const handleClick = ({ target }) => {
    const { dataset } = target;

    // Get the button text - which button was clicked?
    switch (target.innerText.toLowerCase()) {
      case "update":
        // We get the id from our data attribute in the button
        // We update state with this id
        // This will be checked when we submit so we can update, if necessary
        setId2Edit(Number(dataset.todo));
        // How do we find the correct text to use?
        setInputValue(
          todos.find(({ agentId }) => agentId === Number(dataset.todo))
            .firstName
        );
        setMiddleNameValue(
          todos.find(({ agentId }) => agentId === Number(dataset.todo))
            .middleName
        );
        setLastNameValue(
          todos.find(({ agentId }) => agentId === Number(dataset.todo)).lastName
        );
        setDobValue(
          todos.find(({ agentId }) => agentId === Number(dataset.todo)).dob
        );
        setHeightInInchesValue(
          todos.find(({ agentId }) => agentId === Number(dataset.todo))
            .heightInInches
        );
        break;
      case "delete":
        api.delete(dataset.todo).then(() => {
          setTodos((prevTodos) =>
            prevTodos.filter(({ agentId }) => agentId !== Number(dataset.todo))
          );
        });

        break;
      default:
        throw new Error("Invalid! Check your button text!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const todoValue = form.elements[0].value.trim();
    const todomiddleValue = form.elements[1].value.trim();
    const todolastValue = form.elements[2].value.trim();
    const tododobValue = form.elements[3].value.trim();
    const todoheightValue = form.elements[4].value.trim();

    if (todoValue) {
      // Check if this is an edit or a new todo
      if (id2Edit) {
        // We are updating
        api
          .update({
            agentId: id2Edit,
            firstName: todoValue,
            middleName: todomiddleValue,
            lastName: todolastValue,
            dob: tododobValue,
            heightInInches: todoheightValue,
          })
          .then(() => {
            setTodos((prevTodos) =>
              prevTodos.map((todo) => {
                if (todo.agentId === id2Edit) {
                  // Avoid mutating the original todo object
                  // We create a new object by spreading out the original (...todo)
                  // We compose the new object with the updated properties
                  // `inputValue` is piece of state
                  const updatedTodo = {
                    ...todo,
                    firstName: inputValue,
                    middleName: middleNameValue,
                    lastName: lastNameValue,
                    dob: dobValue,
                    heightInInches: heightInInchesValue,
                  };
                  return updatedTodo;
                }

                return todo;
              })
            );
            // ⚠️ Don't get stuck in edit mode!
            setId2Edit(null);

            // Clear the input
            setInputValue("");
            setMiddleNameValue("");
            setLastNameValue("");
            setDobValue("");
            setHeightInInchesValue("");
          })
          .catch((err) => {
            console.error("Some other error.", err);
          });
      }
      // CREATE!
      else {
        api
          .create({
            firstName: todoValue,
            middleName: todomiddleValue,
            lastName: lastNameValue,
            dob: dobValue,
            heightInInches: heightInInchesValue,
          })
          .then((response) =>
            setTodos((prevTodos) => [...prevTodos, response])
          );

        setInputValue("");
        setMiddleNameValue("");
        setLastNameValue("");
        setDobValue("");
        setHeightInInchesValue("");
      }
    }
  };

  return (
    // Fragment tag
    <>
      <form onSubmit={handleSubmit} className="p-4">
        {/* Input gets re-rendered whenever inputValue changes. */}
        <h3>First Name</h3>
        <Input value={inputValue} changeHandler={handleChange} />
        <h3>Middle Name</h3>
        <Input value={middleNameValue} changeHandler={handleMiddleChange} />
        <h3>Last Name</h3>
        <Input value={lastNameValue} changeHandler={handleLastChange} />
        <h3>DOB</h3>
        <Input value={dobValue} changeHandler={handleDobChange} />
        <h3>Height In Inches</h3>
        <Input value={heightInInchesValue} changeHandler={handleHeightChange} />
        <button
          type="submit"
          className="bg-green-500 ml-1 p-4 rounded-sm text-white my-2"
        >
          {id2Edit ? "Update" : "Add"} Todo
        </button>
      </form>

      <ol className="p-4">
        {todos.map(
          ({
            agentId,
            firstName,
            middleName,
            lastName,
            dob,
            heightInInches,
          }) => (
            // TODO: Move this to a new component
            <li key={agentId} className="my-2">
              {firstName} {middleName} {lastName} {dob} {heightInInches}{" "}
              <button
                className="bg-yellow-500 ml-1 rounded-xl p-2"
                onClick={handleClick}
                // TODO{manav.misra}: Find out about naming rules on data attributes
                data-todo={agentId}
              >
                Update
              </button>
              <button
                className="bg-red-500 ml-1 rounded-xl text-white p-2"
                onClick={handleClick}
                data-todo={agentId}
              >
                Delete
              </button>
            </li>
          )
        )}
      </ol>
    </>
  );
}

export default App;
