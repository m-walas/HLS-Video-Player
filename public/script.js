document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('video');
    const playlistSelector = document.getElementById('playlist');
    const loader = document.getElementById('loader');
    const videoContainer = document.querySelector('.video-container');
    let hls;

    function loadMasterPlaylist() {
        if (hls) {
            hls.destroy();
            hls = null;
        }

        hls = new Hls();
        hls.loadSource('master.m3u8');
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            console.log('Manifest loaded, found ' + data.levels.length + ' quality levels');
            data.levels.forEach((level, index) => {
                console.log(`Level ${index}:`, level);
            });
            if (data.levels.length > 0) {
                updateVideoInfo(data.levels[0]);
            } else {
                console.error('No levels found in the manifest');
            }
        });

        hls.on(Hls.Events.LEVEL_SWITCHING, function (event, data) {
            console.log('Switching to level ' + data.level);
            showLoader();
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            console.log('Switched to level ' + data.level);
            const level = hls.levels[data.level];
            updateVideoInfo(level);
            hideLoader();
        });

        hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
            console.log('Level loaded:', data);
            const level = hls.levels[data.level];
            updateVideoInfo(level);
        });

        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (event, data) {
            console.log('Audio tracks updated:', data);
            updateAudioInfo();
        });

        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, function (event, data) {
            console.log('Audio track switched:', data);
            updateAudioInfo();
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error("Network error encountered, attempting to recover...");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error("Media error encountered, attempting to recover...");
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error("Fatal error encountered, destroying instance...");
                        hls.destroy();
                        break;
                }
            }
        });

        playlistSelector.addEventListener('change', function () {
            const selectedResolution = this.value.split('_')[1].split('.')[0];
            console.log(`Selected resolution: ${selectedResolution}`);
            const levelIndex = getLevelIndexByResolution(selectedResolution);
            if (levelIndex !== -1) {
                hls.currentLevel = levelIndex;
                console.log(`Switched to level index: ${levelIndex}`);
            } else {
                console.error('No matching level found for resolution:', selectedResolution);
            }
        });
    }

    function getLevelIndexByResolution(resolution) {
        const height = parseInt(resolution.replace('p', ''));
        for (let i = 0; i < hls.levels.length; i++) {
            if (hls.levels[i].height === height) {
                return i;
            }
        }
        return -1;
    }

    function updateVideoInfo(level) {
        if (level) {
            console.log(`Updating video info: Level: ${level.height || 'N/A'}p, Bitrate: ${level.bitrate ? (level.bitrate / 1000).toFixed(0) + ' kbps' : 'N/A'}, Codec: ${level.codecs || 'N/A'}`);
            document.getElementById('bitrate').textContent = level.bitrate ? (level.bitrate / 1000).toFixed(0) + ' kbps' : 'N/A';
            document.getElementById('resolution').textContent = level.width && level.height ? `${level.width}x${level.height}` : 'N/A';
            document.getElementById('videoCodec').textContent = level.codecs || 'N/A';
        } else {
            console.log('No level data available');
            document.getElementById('bitrate').textContent = 'N/A';
            document.getElementById('resolution').textContent = 'N/A';
            document.getElementById('videoCodec').textContent = 'N/A';
        }
        updateAudioInfo();
    }

    function updateAudioInfo() {
        const audioInfoCommand = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 ${hls.url}`;
        fetch(`/exec?cmd=${encodeURIComponent(audioInfoCommand)}`)
            .then(response => response.text())
            .then(data => {
                console.log('Audio codec info:', data);
                const firstAudioCodec = data.split('\n')[0].trim(); // Get the first codec only
                document.getElementById('audioCodec').textContent = firstAudioCodec || 'N/A';
            })
            .catch(error => {
                console.error('Error fetching audio codec info:', error);
                document.getElementById('audioCodec').textContent = 'N/A';
            });
    }

    function showLoader() {
        videoContainer.classList.add('loading');
    }

    function hideLoader() {
        videoContainer.classList.remove('loading');
    }

    // Load the master playlist by default
    loadMasterPlaylist();
});
