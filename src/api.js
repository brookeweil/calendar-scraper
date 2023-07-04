import fetch from 'node-fetch';


const API_URL = process.env.REACT_APP_API_GATEWAY_URL;

export const scrapeIcsEvents = async (urls) => {
    const response = await fetch(
        API_URL,
        {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({urls}),
            headers: {
                'Content-Type': 'application/json', 
                'X-Auth-Token': process.env.REACT_APP_AUTH_TOKEN
            },
            timeout: 120000 // 2m in ms
        }
    )
    const body = await response.text();
    if (response.status === 200) {
        return body;
    } else {
        alert(body);
        return null;
    }
}