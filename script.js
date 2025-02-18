// console.log('Lets write JavaScript');
let currentSong = new Audio();

async function getSongs() {
  try {
    let a = await fetch("http://127.0.0.1:5500/song/"); //it fetches the song
    let response = await a.text(); //it converts the data present in 'a' into text and store it into response

    // Parse the response into a DOM object
    let parser = new DOMParser();
    // with the help of parser variable/instance of DOM parser class we convert HTML string into DOM.
    // i.e., we are converting html string in DOM
    let doc = parser.parseFromString(response, "text/html");

    // Select all anchor tags (<a>) that have an href starting with "/song/"
    let anchors = doc.querySelectorAll('a[href^="/song/"]');

    // Extract the full URLs and store them in the song array
    let song = Array.from(anchors).map(
      (anchor) => `http://127.0.0.1:5500${anchor.getAttribute("href")}`
    );

    // console.log(song);

    return song;
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});

const playMusic = (track) => {
  // let audio = new Audio("/song/" + track);
  // audio.play();
  // play.src = "pause.svg"
  // document.querySelector(".songinfo")
  currentSong.src = "/song/" + track
  currentSong.play()
  play.src = "assets/pause.svg"
};

async function main() {
  // Get the list of all the songs
  let songs = await getSongs();
  // console.log(songs);

  // Get the unordered list element
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  for (const song of songs) {
    // console.log(song)

    // Extract the song name from the URL
    const songName = decodeURIComponent(song.split("/").pop())

    // Add the song name as a list item
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${songName.replaceAll("%20", " ")}</div>
                                <div>Sarah</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
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
      document.querySelector(".songinfo").innerHTML = ""
      document.querySelector(".songtime").innerHTML = "00:00 / 03:00"
    }
  });
}

//     //play the first song
//     var audio = new Audio(songs[0]);
// audio.play();

// audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   console.log(duration)
//   // The duration variable now holds the duration (in seconds) of the audio clip
// });

// //play the second song
// var audio = new Audio(songs[1]);
// audio.play();

// audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   console.log(duration)
//   // The duration variable now holds the duration (in seconds) of the audio clip
// });

// //play the third song
// var audio = new Audio(songs[2]);
// audio.play();

// audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   console.log(duration)
//   // The duration variable now holds the duration (in seconds) of the audio clip
// });

main()
