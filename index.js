const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

 
app.get('/api/persons', (request, response, next) => {  
  Person.find({}).then(person => {    
      response.json(person)
  })
  .catch(error => next(error))  
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const person = Person.findById(id)
  .then(person =>{
    if (person){
      response.json(person) 
    }else{
      response.status(404).end()
    }       
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log("PUT request body: ",request.body)
  if ( !request.body.number  ) {
    return response.status(400).json({ 
      error: ` Phone number is needed in order to update person's info` 
    })
  }
  const id = request.params.id
  const {number} = request.body
  const updPerson ={
    name: request.params.name,
    number  
  }

  const person = Person.findByIdAndUpdate(id, updPerson, {new: true, runValidators: true, context: 'query'})
  .then(updatedPerson =>{
    response.json(updatedPerson)      
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
  .then(result =>{
    response.status(204).end()  
  })
  .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
    const info = ` <p>Phonebook has info for ${Person.length} persons </p> <p>${Date()}</p>`
    response.send(info)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

// Last middleware EVER, seriously, LAST LINES before server!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})