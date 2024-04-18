const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

 
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
  const person = new Person({
    name,
    number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)  
  }) 
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
  .then(result =>{
    response.status(204).end()  
  })
  .catch(error => {
    response.status(204).end()
  })
})

app.get('/api/info', (request, response) => {
    const info = ` <p>Phonebook has info for ${persons.length} persons </p> <p>${Date()}</p>`
    response.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})