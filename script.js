console.log('Lets write JavaScript');

async function getSongs() {
  try {

    let a = await fetch("http://127.0.0.1:5500/song/");
let response = await a.text();

// Parse the response into a DOM object
let parser = new DOMParser();
let doc = parser.parseFromString(response, "text/html");

// Select all anchor tags (<a>) that have an href starting with "/song/"
let anchors = doc.querySelectorAll('a[href^="/song/"]');

// Extract the full URLs and store them in the song array
let song = Array.from(anchors).map(anchor => 
  `http://127.0.0.1:5500${anchor.getAttribute("href")}`
);

console.log(song);

   
return song

  } catch (error) {
    console.error("Error fetching songs:", error);
  }
  
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});


async function main(){
    //Get the list of all the songs
    let songs =  await getSongs()
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + '<li> ${song.replaceAll("%20")} </li>'
    }

    //play the first song
    var audio = new Audio(songs[0]);
audio.play();


audio.addEventListener("loadeddata", () => {
  let duration = audio.duration;
  console.log(duration)
  // The duration variable now holds the duration (in seconds) of the audio clip
});

}

main()
{

}
