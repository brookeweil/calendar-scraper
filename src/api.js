import fetch from 'node-fetch';


const API_URL = process.env.REACT_APP_LAMDA_URL;

export const scrapeIcsEvents = async (urls) => {
    const response = await fetch(
        API_URL,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({urls}),
            headers: {'Content-Type': 'application/json'}
        }
    )
    if (response.code === 200) {
        return response.body;
    } else {
        alert(response.body);
        return null;
    }
}