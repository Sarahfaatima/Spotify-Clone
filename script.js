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

    //play the first song
    var audio = new Audio(songs[0]);
audio.play();

}

main()
{
    
}

