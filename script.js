// console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
  currFolder = folder;
  try {
    // Fetch the folder content (HTML)
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();

    // Parse the response into a DOM object
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");
    // console.log(doc);

    // Select all <a> tags whose href starts with "/{folder}"
    let anchors = doc.querySelectorAll(`a[href^="/${folder}"]`);
    // console.log(anchors);

    // Build an array of full song URLs
    let songs = Array.from(anchors).map(
      (anchor) => `http://127.0.0.1:5500${anchor.getAttribute("href")}`
    );
    console.log(songs);
    // console.log(currFolder);

    // --- DOM Manipulation: Update the Song List ---
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = ""; // Clear any previous list items

    for (const song of songs) {
      // Extract the song name from the URL (filename only)
      const songName = decodeURIComponent(song.split("/").pop());

      // Append a new <li> to the song list
      songUL.innerHTML += 
        `<li>
          <img class="invert" width="34" src="assets/music.svg" alt="">
          <div class="info">
              <div>${songName.replaceAll("%20", " ")}</div>
              <div>Pakku</div>
          </div>
          <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="assets/play button.svg" alt="">
          </div>
        </li>`;
    }

    // Attach an event listener to each song list item
    Array.from(songUL.getElementsByTagName("li")).forEach((e) => {
      e.addEventListener("click", () => {
        // Extract the song name from the clicked item and play it
        let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
        // console.log("Clicked song:", songName);
        playMusic(songName);
      });
    });
    // --- End DOM Manipulation ---

    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}


// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});

const playMusic = (track, pause = false) => {
  // console.log(track)
  // Check if track is already a full URL
  if (!track.startsWith("http")) {
    track = `/${currFolder}/` + track;
    // console.log(track)

  }

  currentSong.src = track;

  if (!pause) {
    currentSong.play().catch(error => console.error("Playback error:", error));
    play.src = "assets/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track.split("/").pop());
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

  async function displayAlbums(folder){
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(response, "text/html");

  }

async function main() {
  // Get the list of all the songs
  songs = await getSongs("song/cs");
  playMusic(songs[0], true)


  //Display all the albums on the page
  displayAlbums("song")


  //Attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "assets/pause.svg"
    } else {
      currentSong.pause();
      play.src = "assets/musicbutton.svg"
      
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", ()=>{
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
  })

  //Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)* percent)/100  
  })

   // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

   // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})


 // Add an event listener to previous 
  previous.addEventListener("click", () => {
  // console.log("Previous clicked");

  let currentTrack = decodeURIComponent(currentSong.src.split("/").pop()); // Get only filename
  let index = songs.findIndex(song => decodeURIComponent(song.split("/").pop()) === currentTrack);

  if (index > 0) {
    playMusic(songs[index - 1]); // Play the previous song
  }
});

next.addEventListener("click", () => {
  // console.log("Next clicked");

  let currentTrack = decodeURIComponent(currentSong.src.split("/").pop()); // Get only filename
  let index = songs.findIndex(song => decodeURIComponent(song.split("/").pop()) === currentTrack);

  if (index < songs.length - 1) {
    playMusic(songs[index + 1]); // Play the next song
  }
});

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log("Setting volume to", e.target.value, "/ 100")
  currentSong.volume = parseInt(e.target.value) / 100
  // if (currentSong.volume >0){
  //     document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("assets/mute.svg", "assets/volume.svg")
  // }
})

//Load the playlist whenever card is clicked 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  // console.log(e)
  e.addEventListener("click", async items=>{
    songs = await getSongs(`song/${items.currentTarget.dataset.folder}`)
  })
})


};

main()
