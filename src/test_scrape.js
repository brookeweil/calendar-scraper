const { generateIcsData } = require('./scrape.js')

// console.log("process.argv", process.argv)
const urls = [...process.argv]
urls.splice(0, 2); // remove 2 items from index 0; subsequent args are user input
// console.log("input urls", urls)

if (urls.length) {
    generateIcsData(urls).then((result) => console.log('done'))
} else {
    // generateIcsData(['https://www.google.com']).then((result) => console.log(result))
    console.log('No input URLs provided')
}
