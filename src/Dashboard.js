import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import TrackSearchResult from './TrackSearchResults'
import { Container, Form, Card, } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import Player from './Player'
import axios from 'axios'
import './Dashboard.css'



const spotifyApi = new SpotifyWebApi({
    clientId: '853392bf4b9e432bb5bdaefd1b0fe0ed'
})


export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState('')


    function selectTrack(track) {
        setPlayingTrack(track)
        setSearch('')
        setLyrics('')
    }


    useEffect(() => {
        if (!playingTrack) return

        axios.get('https://spotify-lyric-server.herokuapp.com/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            },
        })
            .then(res => {
                setLyrics(res.data.lyrics)
            })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false

        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return

            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                    (smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))

        })
        return () => cancel = true
    }, [search, accessToken])

    return (
        <Container className="d-flex flex-column py-2" style={{
            height: '100vh',

        }}>
            <Form.Control
                type='search'
                placeholder='Search Songs/Artists'
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div
                className='search-results'
                style={{
                    overflowY: 'auto',
                }}>
                {searchResults.map(track => (
                    <TrackSearchResult
                        track={track}
                        key={track.uri}
                        selectTrack={selectTrack}
                    />
                ))}
                {searchResults.length === 0 && (
                    <Card className='lyric-card'>
                        <Container className='img-lyrics' style={{
                            height: '100vh',
                        }}>
                            <Card.ImgOverlay>
                                <Container className='lyrics-container' style={{
                                    height: '95vh',
                                }}>
                                    <Container className='lyrics' style={{
                                        height: '80vh',
                                    }}>
                                        <Container className='lyrics-backdrop'>
                                            <Card.Text className="text-center" style={{
                                                whiteSpace: "pre-wrap"

                                            }}>
                                                {lyrics}
                                            </Card.Text>
                                        </Container>
                                    </Container>
                                </Container>

                            </Card.ImgOverlay>
                        </Container>
                    </Card>
                )}
            </div>
            <div> <Player accessToken={accessToken} trackUri={playingTrack?.uri} /> </div>
        </Container>
    )
}

