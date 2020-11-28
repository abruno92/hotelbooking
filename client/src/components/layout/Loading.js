import React from 'react'
import spinnerGif from '../../images/gif/loading-arrow.gif'

export default function Loading() {
    return (
        <div className="loading">
            <img src={spinnerGif} alt="loading gif"></img>
            <h4>Loading</h4>
        </div>
    )
}
