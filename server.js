const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()


let persons = [
    {
        "name": "carlos",
        "number": "5855",
        "id": 0
    },
    {
        "name": "Ernesto",
        "number": "123156",
        "id": 1
    },
    {
        "name": "x",
        "number": "123",
        "id": 2
    }
]

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

app.get("/api/persons/", (req, res) => {
    res.send(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    person
        ? res.send(person)
        : res.sendStatus(404)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.sendStatus(204)
})

app.post("/api/persons/", (req, res) => {
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
    const foundPerson = persons.find(person => person.name === body.name)
    if (foundPerson) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000000000)
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.get("/info/", (req, res) => {
    res.send(`Phonebook has info for ${Object.keys(persons).length} people\n${new Date()}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})