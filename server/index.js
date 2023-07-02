// export const handler = async (event, context) => {
exports.handler = async (event, context) => {
    console.log({event, context});
    const requestBody = event.body; 
    const path = event.rawPath;
    const query = event.rawQueryString;
    const key = process.env.REACT_APP_GPT_KEY;
    console.log({requestBody, path, query});
    
    switch(path) {
        case '/scrape_events':
            return 'SCRAPING from server/index.js';
        default:
            return {
                "statusCode": 404,
                // "body": "Bad path"
            }
    }
};
