# HLS Video Player

## Project Description

The HLS Video Player project was developed as part of a university course. The aim of the project was to create a video player using HLS (HTTP Live Streaming) technology, which allows for dynamic quality switching. The application displays information about bitrate, resolution, and the video and audio codecs used.

## Features

- Dynamic video quality switching (720p, 480p, 360p).
- Display of bitrate, resolution, and video and audio codecs information.
- Automatic recovery from network and media errors.

## Technologies

- HTML5
- CSS3
- JavaScript
- HLS.js
- Node.js
- ffmpeg

## Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/m-walas/hls-video-player.git
    cd hls-video-player
    ```

2. **Install Node.js and npm:**

    Download and install Node.js and npm from the [official Node.js website](https://nodejs.org/).

3. **Install HTTP Server:**

    ```bash
    npm install -g http-server
    ```

4. **Run the server:**

    ```bash
    http-server
    ```

    The server will start on port 8080 by default. The page will be accessible at `http://127.0.0.1:8080`.

## Project Files

- `index.html` - Structure of the web page.
- `styles.css` - CSS styles for the page.
- `script.js` - Application logic.
- `server.js` - HTTP server logic.
- `master.m3u8` - Master playlist.
- `playlist_720p.m3u8`, `playlist_480p.m3u8`, `playlist_360p.m3u8` - HLS playlists for different resolutions.
- `segment_720p_000.ts`, `segment_480p_000.ts`, `segment_360p_000.ts` - Video segments.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
