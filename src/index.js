const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find( customer => customer.username === username)

  if(!user) {
    return response.status(404).json({error: "User not Found"})
  }

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some( user => {
    return user.username === username
  })

  if(userAlreadyExists) {
    return response.status(400).json({error: " Username: user Already Exists"})
  }

  users.push({ 
    id: uuidv4(), // precisa ser um uuid
    name, 
    username, 
    todos: []
  })

  return response.status(201).send()
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request 
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request

  if(!title && !deadline){
    return response.status(400).json({erro: "parameters invalid"})
  }

  const addTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(addTodo)

  return response.status(201).send()
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const index = user.todos.findIndex( i => i.id === id)

  user.todos[index].title = title
  user.todos[index].deadline = new Date(deadline)

  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const index = user.todos.findIndex( i => i.id === id)

  user.todos[index].done = true

  return response.status(201).send()

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;