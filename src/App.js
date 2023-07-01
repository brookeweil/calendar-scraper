import './App.css';
import { useState } from 'react';
import { ChakraProvider, Textarea, Button, Heading } from '@chakra-ui/react'
import cookie from 'react-cookies'

import {generateIcsData} from './scrape.js'


function App() {
  
  const cookieValue = cookie.load('calendarUrls');
  // console.log({cookieValue})
  const [inputText, setInputText] = useState(cookieValue ? cookieValue.join(', ') : []);
  
  const parseUrls = (text) => {
    const newUrls = text.split(/[\n,\s]/).map(url => url.trim()).filter(url => url.length > 0);
    return newUrls
  }

  const generateIcsEvents = async () => {
    // console.log({inputText})
    const urls = parseUrls(inputText);
    cookie.save('calendarUrls', urls);
    // parseUrls(urls)
    console.log({urls});
    const icsData = await generateIcsData(urls);
    // console.log(icsData);
    // https://spin.atomicobject.com/2022/03/09/create-export-react-frontend/

    // https://spin.atomicobject.com/2022/03/09/create-export-react-frontend/
    const blob = new Blob([icsData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "events.ics";
    link.href = url;
    link.click();
  }

  console.log({environment: process.env}) 
  console.log({secrets: process.env}) 

  return (
    <ChakraProvider>
      <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
        {process.env.NODE_ENV === 'development' &&  <Heading color='orange'>DEV</Heading>}
        <div style={{ minWidth: 400, maxWidth: 800, width: '80%' }}>
          <div style={{padding: '40px 0'}}>
            Put in some urls of calendar pages, and we'll generate a combined calendar for you.
          </div>
          <Textarea style={{ height: 250 }} onChange={event => setInputText(event.target.value)} 
            placeholder="Insert calendar page URLs here, separated by commas or line breaks"
            defaultValue={inputText} />
          <div style={{padding: '20px 0'}}>
            <Button colorScheme="green" size="lg" onClick={generateIcsEvents} isDisabled={!inputText}>
              Generate
            </Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
