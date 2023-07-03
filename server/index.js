import { generateIcsData } from './scrape.js';


export const handler = async (event, context) => {
    console.log({event, context});
    const requestBody = JSON.parse(event.body); 

    const path = event.rawPath;
    const query = event.rawQueryString;
    console.log({requestBody, path, query});
    
    switch(path) {
        case '/scrape_events':
            if (Array.isArray(requestBody.urls) && requestBody.urls.length) {
                const result = generateIcsData(requestBody.urls);
                return result;
            } else {
                return {
                    statusCode: 400,
                    body: {
                        length: requestBody.urls.length,
                        isArray: Array.isArray(requestBody.urls),
                        error: 'Request body must contain a non-empty array of urls'
                    }
                }
            }
        default:
            return {
                'statusCode': 404,
                'body': 'Bad path'
            }
    }
};
