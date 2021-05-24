const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js

const audioPlayer = AudioPlayer();

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const playPreview = (ev) => {
    console.log('hi')
    const preview_url = ev.currentTarget.getAttribute("data-preview-track");
    // const sourceElement = ev.currentTarget.dataset.preview-track;
    audioPlayer.setAudioFile(preview_url);
    audioPlayer.play();
    console.log(sourceElement)
    console.log('hello')
}

const getTracks = (term) => {
    const elem = document.querySelector('#tracks');
    elem.innerHTML = "";
    url = baseURL + "?type=track&q=" + term + "&limit=5";
    fetch(url)
        .then(response => response.json())
        // .then(data => displayTracks(data));
        .then(data => {
            for(const track of data) { 
                elem.innerHTML += displayTracks(track);
            }
        })
    .then(() => {
        document.querySelectorAll('.track-item.preview').forEach(track => {track.onclick = playPreview});
        console.log('third-then')
    })
};

const getAlbums = (term) => {
    const elem = document.querySelector('#albums');
    elem.innerHTML = "";
    url = baseURL + "?type=album&q=" + term + "&limit=5";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            for(const album of data) { 
                elem.innerHTML += displayAlbums(album);
            }
        })
}

const getArtist = (term) => {
    url = baseURL + "?type=artist&q=" + term;
    fetch(url)
        .then(response => response.json())
        .then(data => displayArtist(data[0]));
};

document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};

const displayTracks = (foundtracks) => {
    // if (foundtracks[0] == null){
    //     document.querySelector("#tracks").innerHTML =  "no tracks found.";
    // }
    return `<section class="track-item preview" data-preview-track="${foundtracks.preview_url}">
        <img src="${foundtracks.album.image_url}">
        <i class="fas play-track fa-play" aria-hidden="true"></i>
        <div class="label">
        <h3>${foundtracks.name}</h3>
        <p>${foundtracks.artist.name}</p>
        </div>
    </section>`;
        // document.querySelector("#tracks").innerHTML += template;
    }   


const  displayArtist = (art) => {
    if (art == null) {
        document.querySelector("#artist").innerHTML = "no artist found."
    }
    else { 
        template = `<section class="artist-card" id="${art.id}">
                <div>
                <img src="${art.image_url}">
                    <h3>${art.name}</h3>
                    <div class="footer">
                        <a href="${art.spotify_url}" target="_blank">
                        view on spotify
                        </a>
                    </div>
                </div>
                </section>`;
    document.querySelector('#artist').innerHTML = template;
    }
}

const displayAlbums = (foundalbum) => {
return `<section class="album-card" id="${foundalbum.id}">
                <div>
                        <img src="${foundalbum.image_url}">
                        <h3>${foundalbum.name}</h3>
                        <div class="footer">
                        <a href="${foundalbum.spotify_url}" target="_blank">
                        view on spotify
                        </a>
                    </div>
                </div>
                </section>`;
}