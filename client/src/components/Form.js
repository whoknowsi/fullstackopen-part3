import React from 'react'

const Form = ({ handleSubmit, newName, setNewName, newNumber, setNewNumber }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>name:
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            <div>number:
                <input
                    value={newNumber}
                    onKeyPress={(event) => (!/[0-9]/.test(event.key)) && event.preventDefault()}
                    onChange={(e) => setNewNumber(e.target.value)}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Form