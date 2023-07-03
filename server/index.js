import { generateIcsData } from './scrape.js';


export const handler = async (event, context) => {
    console.log({event, context});
    const requestBody = JSON.parse(event.body); 

    const path = event.rawPath;
    const query = event.rawQueryString;
    const token = event.headers['x-auth-token'];

    if (token !== process.env.AUTH_TOKEN) {
        return {
            statusCode: 401,
            body: 'Unauthorized'
        }
    }

    console.log({requestBody, path, query});
    
    const headers = {
        'Access-Control-Allow-Origin': '*'
    };
    

    switch(path) {
        case '/scrape_events':
            if (Array.isArray(requestBody.urls) && requestBody.urls.length) {
                const result = await generateIcsData(requestBody.urls);
                return {
                    headers,
                    statusCode: 200,
                    body: result
                };
            } else {
                return {
                    headers, 
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
