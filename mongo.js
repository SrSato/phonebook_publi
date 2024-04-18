const mongoose = require('mongoose')

let showPhonebook = false

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length==3) {
    showPhonebook = true
}

if(process.argv.length<5 && process.argv.length>3){
    console.log('give name AND number in order to add a new person')
    process.exit(1)
}

if( process.argv.length>5){
    console.log('Mongo.js arguments must be ([optional]): pwd [name] [number]')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://sato:${password}@fullstack.et1c3ku.mongodb.net/fullstack?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(showPhonebook){
    console.log("Phonebook: ")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })      
}else{
    const person = new Person({
        name: name,
        number: number,
      })
      
      person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
      })
}

