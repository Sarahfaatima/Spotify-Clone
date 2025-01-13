console.log("Let's write JavaScript!");

async function main() {
    try {
        // Fetch the response from the given URL
        let response = await fetch("http://127.0.0.1:5500/songs/");
        
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Extract the response as text
        let responseText = await response.text();
        console.log("Response text:", responseText);

        // Create a temporary div element to parse the HTML response
        let div = document.createElement("div");
        div.innerHTML = responseText;

        // Extract all anchor (<a>) tags
        let links = div.getElementsByTagName("a");
        console.log("Extracted links:", links);

        // Log the href attribute of each link
        Array.from(links).forEach(link => {
            console.log("Link href:", link.href);
        });
    } catch (error) {
        // Log any errors encountered during execution
        console.error("An error occurred:", error);
    }
}

// Invoke the main function
main();
