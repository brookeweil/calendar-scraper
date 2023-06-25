// const fetch = require('node-fetch');
const ics = require('ics')
// const { minify } = require('html-minifier-terser');
// const sanitizeHtml = require('sanitize-html');


// const scrapeHtml = async (url) => {
//     const response = await fetch(url, {mode: 'cors'});
//     const body = await response.text();
//     // console.log(`html len: ${body.length}}`)
//     return body;
// }

// const compressHtml = async (html) => {
//     // https://www.npmjs.com/package/html-minifier-terser
//     // console.log(html);
//     console.log(`original html len: ${html.length}}`)
    
//     // https://www.npmjs.com/package//sanitize-html
//     const cleaned = sanitizeHtml(html, {
//         // overrides
//         nonTextTags: [ 
//             'head', 'aside', 'footer', 'header', 'nav', 'meta',
//             'style', 'script', 'textarea', 'option', 'noscript' ],
//         allowedTags: [
//             "address", "h1", "h2", "h3", "h4", "h5", "h6", 
//             "hgroup", "main", "section", "blockquote", "dd", // "div",
//             "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
//             "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
//             "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
//             "small", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
//             "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
//         ],
//         nonBooleanAttributes: ['*'],
//         // defaults (https://github.com/apostrophecms/sanitize-html#default-options)
//         disallowedTagsMode: 'discard',
//         allowedAttributes: {
//         a: [ 'href', 'name', 'target' ],
//         // We don't currently allow img itself by default, but
//         // these attributes would make sense if we did.
//         img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
//         },
//         // Lots of these won't come up by default because we don't allow them
//         selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta', ],
//         // URL schemes we permit
//         allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
//         allowedSchemesByTag: {},
//         allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
//         allowProtocolRelative: true,
//         enforceHtmlBoundary: false,
//         parseStyleAttributes: true
//     });
//     // console.log({cleaned})
    
//     const result = await minify(cleaned, {
//         collapseWhitespace: true,
//         minifyCSS: true,
//         minifyJS: true,
//         processConditionalComments: true,
//         removeComments: true,
//         removeEmptyAttributes: true,
//         removeEmptyElements: true,
//         removeOptionalTags: true,
//         removeRedundantAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         removeAttributeQuotes: true,
//     });
//     console.log(`\n\ncompressed:\n\n${result}\n\n`)
//     console.log(`cleaned html type: ${typeof cleaned}}`)
//     console.log(`cleaned html len: ${cleaned.length}}`)
//     console.log(`compressed html len: ${result.length}}`)
//     return result;


// }

// const formatPrompt = async (url, html) => {
//     let prompt = `Take this source URL and HTML of an events page and extract a list of events with the event name, date in YYYY-MM-DD format, and url link for more information. HTML unencode any text in the results if needed. For the URL links, if they are relative URLs, use the source URL to make them absolute URLs.  Give the results as JSON, with the keys "eventName", "urlLink",  "date"`
//     prompt += `Here is the source URL:\n${url}\n`
//     prompt += `Here is the HTML:\n${html}`
//     return prompt
// }

// const sendGptRequest = async (prompt) => {
//     return 'TODO sendGptRequest'
// }

const extractEvents = async (url, html) => {
    // const prompt = formatPrompt(url, html);
    // const gptResponse = await sendGptRequest(prompt);
    const gptResponse = 
    [
       {
          "eventName":"Vecchia Nuova - Dine & Donate",
          "urlLink":"https://www.annsheart.org/index.php/component/djevents/details/2023-07-20/18-vecchia-2023",
          "date":"2023-07-20"
       },
       {
          "eventName":"Phoenixville Bed Races 2023",
          "urlLink":"https://www.annsheart.org/index.php/component/djevents/details/2023-11-04/12-bed-races-23",
          "date":"2023-11-04"
       }
    ]
    return gptResponse
}

const formatIcsData = async (events) => {
    // https://www.npmjs.com/package/ics
    const formatIcsInput = (title, date, url) =>  ({
        title,
        start: [...date.split("-"), '0', '0'].map(v => parseInt(v)), // split YYYY-MM-DD and add 00:00 time
        duration: { days: 1 },
        url,
    })
    const icsInputs = events.map(({ eventName, date, urlLink }) => formatIcsInput(eventName, date, urlLink))

    // console.log('icsInputs')
    // console.log(icsInputs)

    const { error, value } = ics.createEvents(icsInputs)
      
    if (error) {
        console.log(`ICS formatting error: ${error}`)
        return
    }

    return value
}

// const generateIcsData = async (urls) => {
export const generateIcsData = async (urls) => {
    const allEvents = []
    for (const url of urls) {
        // const html = await scrapeHtml(url)
        // const compressedHtml = await compressHtml(html)
        const compressedHtml = null
        const events = await extractEvents(url, compressedHtml)
        allEvents.push(...events)
    }
    return await formatIcsData(allEvents)
}

// exports.generateIcsData = generateIcsData
