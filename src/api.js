import fetch from 'node-fetch';


const API_URL = process.env.REACT_APP_API_GATEWAY_URL;
console.log({API_URL});

export const scrapeIcsEvents = async (urls) => {
    const response = await fetch(
        API_URL,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({urls}),
            // headers: {'Content-Type': 'application/json'},
            // origin: 'https://brookeweil.github.io/calendar-scraper/'
        }
    )
    if (response.code === 200) {
        return response.body;
    } else {
        alert(response.body);
        return null;
    }
}