import React from 'react'
import Spinner from '../images/gif/loading-arrow.gif'

export default function Loading() {
    return (
        <div className="loading">
            <img src={Spinner} alt="loading gif"></img>
        </div>
    )
}