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
  
  try {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`); //it fetches the song
    console.log(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text(); //it converts the data present in 'a' into text and store it into response

    // Parse the response into a DOM object
    let parser = new DOMParser();
    // with the help of parser variable/instance of DOM parser class we convert HTML string into DOM.
    // i.e., we are converting html string in DOM
    let doc = parser.parseFromString(response, "text/html");
    console.log(doc)

    // Select all anchor tags (<a>) that have an href starting with "/song/ncs"
    let anchors = doc.querySelectorAll(`a[href^="/${folder}"]`);

    console.log(anchors)

    // Extract the full URLs and store them in the song array
    let song = Array.from(anchors).map(
      (anchor) => `http://127.0.0.1:5500${anchor.getAttribute("href")}`
    );

    // console.log(song);
    currFolder = folder;
  console.log(currFolder)

    return song;
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});

const playMusic = (track, pause = false) => {
  console.log(track)
  // Check if track is already a full URL
  if (!track.startsWith("http")) {
    track = `/${currFolder}/` + track;
    console.log(track)

  }

  currentSong.src = track;

  if (!pause) {
    currentSong.play().catch(error => console.error("Playback error:", error));
    play.src = "assets/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track.split("/").pop());
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function main() {
  // Get the list of all the songs
  songs = await getSongs("song/ncs");
  playMusic(songs[0], true)
  console.log(songs);

  // Get the unordered list element
  let songUL = document
    .querySelector(".songList ul")
    // .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  for (const song of songs) {
    // console.log(song)

    // Extract the song name from the URL
    const songName = decodeURIComponent(song.split("/").pop())

    // Add the song name as a list item
    songUL.innerHTML += 
    `<li>
      <img class="invert" width="34" src="assets/music.svg" alt="">
                            <div class="info">
                                <div> ${songName.replaceAll("%20", " ")}</div>
                                <div>Pakku</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="assets/play button.svg" alt="">
                            </div> </li>`;
  } 

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      // e.addEventListener("click", element => {
      //     playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    });
  });

  

  // return songs

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
    console.log(currentSong.currentTime, currentSong.duration)
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
  console.log("Previous clicked");

  let currentTrack = decodeURIComponent(currentSong.src.split("/").pop()); // Get only filename
  let index = songs.findIndex(song => decodeURIComponent(song.split("/").pop()) === currentTrack);

  if (index > 0) {
    playMusic(songs[index - 1]); // Play the previous song
  }
});

next.addEventListener("click", () => {
  console.log("Next clicked");

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
  if (currentSong.volume >0){
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
  }
})


}

main()
