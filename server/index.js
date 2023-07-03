import { generateIcsData } from './scrape.js';

// https://docs.aws.amazon.com/apigateway/latest/developerguide/handle-errors-in-lambda-integration.html
export const handler = async (event, context) => {
    console.log({event, context});
    const method = event.routeKey ? event.routeKey.split(' ')[0] : null;
    const token = event.headers['x-auth-token'];
    console.log({method});
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*'
    };

    if (method === 'OPTIONS') {
        return {
            headers,
            statusCode: 200
        } 
    }
    
    if (token !== process.env.AUTH_TOKEN) {
        return {
            headers,
            statusCode: 401,
            body: 'Unauthorized'
        }
    }
    
    // TODO ignore non posts
    const path = event.rawPath;
    const query = event.rawQueryString;
    const requestBody = JSON.parse(event.body); 
    console.log({requestBody, path, query});
    

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
                headers, 
                'statusCode': 404,
                'body': 'Bad path'
            }
    }
};
