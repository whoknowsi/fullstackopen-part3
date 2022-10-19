const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()   

const Person = require("./models/person")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

app.get("/api/persons/", async (req, res) => {
    const persons = await Person.find({})
    res.json(persons)
})

app.get("/api/persons/:id", async (req, res, next) => {
    const id = req.params.id
    try {
        const foundPerson = await Person.findById(id)
        foundPerson 
                ? res.json(foundPerson)
                : res.status(404).end()        
    } 
    catch (error) { next(error) }
})

app.post("/api/persons/", async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: "content missing"
        })
    }
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    const foundPerson = await Person.findOne({name: body.name})
    if(foundPerson) {
        return res.status(400).json({ error: "name must be unique" })
    }

    const newPerson = Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
    
})

app.delete("/api/persons/:id", async (req, res, next) => {
    const id = req.params.id
    try {
        const deletedPerson = await Person.findByIdAndDelete(id)
        deletedPerson
                ? res.json(deletedPerson)
                : res.sendStatus(204)
    }
    catch (error) { next(error) }
})

app.put("/api/persons/:id", async (req, res, next) => {
    const id = req.params.id
    const body = req.body

    if (!body) {
        return res.status(400).json({
            error: "content missing"
        })
    }

    const toUpdate = {
        number: body.number
    }

    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, toUpdate, { new: true })
        updatedPerson
                ? res.json(updatedPerson)
                : res.sendStatus(204)
    }
    catch (error) { next(error) }
})


app.get("/info/", async (req, res) => {
    const persons = await Person.find({})
    res.send(`Phonebook has info for ${Object.keys(persons).length} people\n${new Date()}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})