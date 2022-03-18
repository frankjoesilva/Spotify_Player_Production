import React from 'react'
import './TrackSearchResults.css'

export default function TrackSearchResult({ track, selectTrack }) {
    function handlePlay() {
        selectTrack(track)
    }

    return (
        <div className="d-flex m-2 align-items-center"
            style={{ cursor: 'pointer' }}
            onClick={handlePlay}>
            <img src={track.albumUrl} alt={''} style={{ height: "64px", width: "64px", }} />
            <div className='m1-3'>
                <div>{track.title}</div>
                <div className='text-mute'>{track.artist}</div>
            </div>
        </div>
    )
}