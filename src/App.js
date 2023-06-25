import './App.css';
import { useState } from 'react';
import { ChakraProvider, Textarea, Button } from '@chakra-ui/react'

import {generateIcsData} from './scrape.js'


function App() {

  // state variable for urls
  const [urls, setUrls] = useState([]);

  const parseAndSetUrls = (text) => {
    const newUrls = text.split(/[\n,\s]/).map(url => url.trim()).filter(url => url.length > 0);
    // console.log(newUrls);
    setUrls(newUrls);
  }

  const generateIcsEvents = async () => {
    const icsData = await generateIcsData(urls);
    console.log(icsData);
    // https://spin.atomicobject.com/2022/03/09/create-export-react-frontend/

    // https://spin.atomicobject.com/2022/03/09/create-export-react-frontend/
    const blob = new Blob([icsData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "events.ics";
    link.href = url;
    link.click();
  }



  return (
    <ChakraProvider>
      <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ minWidth: 400, maxWidth: 800, width: '80%' }}>
          <div style={{padding: '40px 0'}}>
            Put in some urls of calendar pages, and we'll generate a combined calendar for you.
          </div>
          <Textarea style={{ height: 250 }} onChange={event => parseAndSetUrls(event.target.value)}
            placeholder="Insert calendar page URLs here, separated by commas or line breaks" />
          <div style={{padding: '20px 0'}}>
            <Button colorScheme="green" size="lg" onClick={generateIcsEvents}>
              Generate
            </Button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
