const fetch = require('node-fetch');
const ics = require('ics')
const { minify } = require('html-minifier-terser');
const sanitizeHtml = require('sanitize-html');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.REACT_APP_GPT_KEY,
}));


const scrapeHtml = async (url) => {
    const response = await fetch(url, {mode: 'cors'});
    const body = await response.text();
    return body;
}

const compressHtml = async (html) => {
    // https://www.npmjs.com/package//sanitize-html
    const cleaned = sanitizeHtml(html, {
        // overrides
        nonTextTags: [ 
            'head', 'aside', 'footer', 'header', 'nav', 'meta',
            'style', 'script', 'textarea', 'option', 'noscript' ],
        allowedTags: [
            "address", "h1", "h2", "h3", "h4", "h5", "h6", 
            "hgroup", "main", "section", "blockquote", "dd", // "div",
            "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
            "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
            "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
            "small", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
            "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
        ],
        nonBooleanAttributes: ['*'],
        // defaults (https://github.com/apostrophecms/sanitize-html#default-options)
        disallowedTagsMode: 'discard',
        allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
        },
        // Lots of these won't come up by default because we don't allow them
        selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta', ],
        // URL schemes we permit
        allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
        allowProtocolRelative: true,
        enforceHtmlBoundary: false,
        parseStyleAttributes: true
    });
    
    // https://www.npmjs.com/package/html-minifier-terser
    const result = await minify(cleaned, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeEmptyElements: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeAttributeQuotes: true,
    });

    console.log(`original html len: ${html.length}}`)
    console.log(`cleaned html len: ${cleaned.length}}`)
    console.log(`compressed html len: ${result.length}}`)
    return result;


}

const formatPrompt = (url, html) => {
    let prompt = `Take this source URL and HTML of an events page and extract a list of events with the event name, date in YYYY-MM-DD format, and url link for more information. HTML unencode any text in the results if needed. For the URL links, if they are relative URLs, use the source URL to make them absolute URLs.  Give the results as JSON, with the keys "eventName", "urlLink",  "date".\n`
    prompt += `Here is the source URL:\n${url}\n`
    prompt += `Here is the HTML:\n${html}\n`
    prompt += `Respond with just the minified JSON object.`
    return prompt
}

const sendGptRequest = async (prompt, url) => {
    let completion = null;

    try {
        completion = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 750,
            prompt: prompt,
            temperature: 0,
        });
    } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
        return null;
    }
    const finishReason = completion.data.choices[0]['finish_reason'];
    if (finishReason === 'length') {
        console.log(`The page ${url} was too long. Please try again with a smaller event list.`)
        return null;
    }

    const response = JSON.parse(completion.data.choices[0].text);
    const tokens = completion.data.usage.total_tokens;
    console.log(`cost: $${(tokens * .02 / 1000).toFixed(2)}`);
    return response;
}

const extractEvents = async (url, html) => {
    const prompt = formatPrompt(url, html);
    const gptResponse = await sendGptRequest(prompt, url);
    return gptResponse
}

const formatIcsData = (events) => {
    // https://www.npmjs.com/package/ics
    const formatIcsInput = (title, date, url) =>  ({
        title,
        start: [...date.split("-"), '0', '0'].map(v => parseInt(v)), // split YYYY-MM-DD and add 00:00 time
        duration: { days: 1 },
        url,
    })
    const icsInputs = events.map(({ eventName, date, urlLink }) => formatIcsInput(eventName, date, urlLink))

    const { error, value } = ics.createEvents(icsInputs)
    if (error) {
        console.log(`ICS formatting error: ${error}`)
        return null;
    }
    return value
}

// const generateIcsData = async (urls) => {
export const generateIcsData = async (urls) => {
    console.log(`Getting events for urls: ${urls}`)
    const allEvents = []
    for (const url of urls) {
        const html = await scrapeHtml(url)
        const compressedHtml = await compressHtml(html)
        // const compressedHtml = null
        const events = await extractEvents(url, compressedHtml)
        if (events) {
            allEvents.push(...events)
        }
    }
    return allEvents.length ? formatIcsData(allEvents) : null;
}

// exports.generateIcsData = generateIcsData
