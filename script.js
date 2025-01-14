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

   

  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  getSongs();
});

async function main() {
    try {
        // Fetch the list of all songs
        let songs = await getSongs();
        console.log("Songs fetched:", songs);

        // Ensure the songs array is not empty
        if (!songs || songs.length === 0) {
            console.error("No songs found to play.");
            return;
        }

        // Validate the first song URL
        const firstSong = songs[0];
        if (!firstSong.startsWith("http")) {
            console.error("Invalid song URL:", firstSong);
            return;
        }

        // Play the first song
        let audio = new Audio(firstSong);
        audio.play()
            .then(() => {
                console.log("Playing:", firstSong);
            })
            .catch((error) => {
                console.error("Error playing audio:", error);
            });
    } catch (error) {
        console.error("Error in main function:", error);
    }
}


