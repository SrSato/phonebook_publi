const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

/*
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

const generateId = () =>{
  max=1000000
  return Math.floor(Math.random() * max)
}
  
app.get('/api/persons', (request, response) => {  
  Person.find({}).then(person => {    
      response.json(person)
    })  
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = Person.findById(id)
  .then(person =>{
    response.json(person)    
  })
  .catch(error => {
    response.status(404).end()
  })
})

app.post('/api/persons', (request, response) => {
  console.log("POST request body: ",request.body)
  if (!request.body.name || !request.body.number  ) {
    return response.status(400).json({ 
      error: ` Some person's data is missing. Please check name and number` 
    })
  }
  const {name, number} = request.body
  const person = {
    name,
    number,
    id: generateId(),
  }

  if (persons.find(anotedPerson => anotedPerson.name.toLowerCase() === person.name.toLowerCase() )){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  persons = persons.concat(person)
  
  response.json(person)  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/info', (request, response) => {
    const info = ` <p>Phonebook has info for ${persons.length} persons </p> <p>${Date()}</p>`
    response.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})