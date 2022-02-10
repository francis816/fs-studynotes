import React from 'react'

const Notification = ({ message }) => {
    // if you don't have this condition below and you set useState = null,
    // you will see a long empty box with red border and empty string
    if (message === null) {
        return null
    }

    return (
        <div className='error'>
            {message}
        </div>
    )
}

export default Notification