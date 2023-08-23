const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 9999;
const cors = require('cors');
const jsonDict = require('./jmdict-eng-3.5.0.json');
const kuromoji = require("kuromoji");
const readings = require('./readings.json');
// const r = require('../../node_modules/kuromoji/dict')

let appTokenizer = null

kuromoji.builder({ dicPath: "../../node_modules/kuromoji/dict" }).build(function (err, tokenizer) {
  // tokenizer is ready
  appTokenizer = tokenizer
  // var path = appTokenizer.tokenize("すもももももももものうち");
  // console.log(appTokenizer.tokenize("すもももももももものうち"));
});


function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hour = String(date.getHours());

  return `${month}-${day}-${year}-${hour}`;
}

async function copyFile(srcPath, destPath, jsonData) {
  try {
    await fs.copyFile(srcPath, destPath);
    console.log(`File copied from ${srcPath} to ${destPath}`);

    await fs.writeFile(`${srcPath}`, JSON.stringify(jsonData, null, 2));
    console.log('JSON data saved to file.');
  } catch (err) {
    console.error('Error during file operations:', err);
  }
}

// Enable express to use CORS
app.use(cors());
// Enable express to parse JSON request bodies
app.use(express.json({limit: '50mb'}));

app.post('/tokenize', (req, res) => {
  const jsonData = req.body;

  // console.log(appTokenizer.tokenize("すもももももももものうち"));
// console.log(jsonData)
  if(appTokenizer && jsonData.reading) {
    let searchResults = appTokenizer.tokenize(jsonData.reading)
    console.log(searchResults)
    res.status(200).send(JSON.stringify(searchResults));
  }
});

app.get('/readings', (req, res) => {
  res.status(200).send(JSON.stringify(readings));
});


app.post('/readings', (req, res) => {
  const jsonData = req.body;
  const sourcePath = './readings.json';
  const destinationPath = `./backups/readings--${formatDate(new Date())}.json`;

  copyFile(sourcePath, destinationPath, jsonData)
    .then(() => {
      console.log('readings.json copied and updated successfully');
      res.status(200).send('JSON data saved successfully.');
    })
    .catch((err) => {
      console.error('Failed to copy the file: readings.json', err);
      res.status(500).send('Failed to save JSON data.');
    });
});

app.post('/save-json', (req, res) => {
  const jsonData = req.body;
  const sourcePath = './db.json';
  const destinationPath = `./backups/db-back-up--${formatDate(new Date())}.json`;

  copyFile(sourcePath, destinationPath, jsonData)
    .then(() => {
      console.log('db.json copied and updated successfully');
      res.status(200).send('JSON data saved successfully.');
    })
    .catch((err) => {
      console.error('Failed to copy the file: db.json', err);
      res.status(500).send('Failed to save JSON data.');
    });
});

const search = (searchQueryArray) => {
  return jsonDict.words.filter(f => {
    let searchString = String([...f.kana.map(k => k.text), ...f.kanji.map(k => k.text)]);
    return searchQueryArray.some(sq => searchString.indexOf(sq) > -1);
  });
}

const searchExact = (searchQueryArray) => {
  return jsonDict.words.filter(f => {
    let searchExactValues = [...f.kana.map(k => k.text), ...f.kanji.map(k => k.text)];
    return searchQueryArray.some(sq => searchExactValues.includes(sq));
  });
}

// searchQueryArray = [{searchQuery: string, tokenPosition: number}
const searchExactTokens = (searchQueryArray) => {
  let tokenResults = []

  jsonDict.words.forEach(f => {
    let searchExactValues = [...f.kana.map(k => k.text), ...f.kanji.map(k => k.text)];
    searchQueryArray.forEach(sq => {
      if(searchExactValues.includes(sq.searchQuery)) {
        tokenResults.push({ ...sq, vocab: f})
      }
    })  
  });

  return tokenResults
}

const searchByIds = (searchIdArray) => {
  let items = jsonDict.words.filter(f => {
    return searchIdArray.indexOf(f.id) > -1
  })
  return items
}

app.post('/search', (req, res) => {
  const jsonData = req.body;

  if(jsonData.ids && jsonData.ids.length > 0) {
    let searchResults = searchByIds(jsonData.ids)
    res.status(200).send(JSON.stringify(searchResults));
  }

  if(jsonData.query && jsonData.query.length > 0) {
    let searchResults = jsonData.exact !== undefined ? searchExact(jsonData.query) : search(jsonData.query)
    res.status(200).send(JSON.stringify(searchResults));  
  }

  if(jsonData.tokens && jsonData.tokens.length > 0) {
    let searchResults = searchExactTokens(jsonData.tokens)
    res.status(200).send(JSON.stringify(searchResults));  
  }

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
