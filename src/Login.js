import React from 'react'
import './Login.css'

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=853392bf4b9e432bb5bdaefd1b0fe0ed&response_type=code&redirect_uri=https://spotify-playerv2.herokuapp.com&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {

    return <div className='login'>
        <img
            src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
            alt=""
        />
        <a href={AUTH_URL}>LOGIN WITH SPOTIFY</a>
    </div>
}


