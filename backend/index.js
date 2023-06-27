// Must restart server manually after changing middleware

const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

// express.json parses JSON data into JS object
// When a request is received, express.json() middleware checks if the Content-Type header is set to application/json.
// If the Content-Type is application/json, the middleware parses the JSON data in the request body and constructs a JavaScript object from it.
// The resulting object is then attached to the req.body property, making it accessible to subsequent middleware functions or route handlers.
app.use(express.json());

// Create custom token
morgan.token("reqBody", (req, res) => {
  return JSON.stringify(req.body);
});

// Use pre-existing tokens (method, url etc) and custom token reqBody
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Response.send will not convert non-objects to JSON, unlike Response.json
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/info", (request, response) => {
  const numPeople = persons.length;
  const curTime = new Date();
  response.send(`Phonebook has info for ${numPeople} people <br> ${curTime}`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number must be provided",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
