const fs = require('fs');
const http = require('http');
const url = require('url');

// read and parse pet data
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const petData = JSON.parse(json);

// create web server
const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // PETS OVERVIEW
  if (pathName === '/pets' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      'utf-8',
      (err, data) => {
        let output = data;

        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          'utf-8',
          (err, data) => {
            const cardsOutput = petData
              .map((pet) => replaceTemplate(data, pet))
              .join('');
            output = output.replace('{%CARDS%}', cardsOutput);

            res.end(output);
          }
        );
      }
    );

    // PET DETAILS
  } else if (pathName === '/pet' && id < petData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-pet.html`,
      'utf-8',
      (err, data) => {
        const pet = petData[id];
        const output = replaceTemplate(data, pet);
        res.end(output);
      }
    );

    // URL NOT FOUND
  }

  // IMAGES
  else if (/\.(jpg|jpeg|png||gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Listening for requests now');
});

function replaceTemplate(originalHtml, pet) {
  let output = originalHtml.replace(/{%PETNAME%}/g, pet.petName);
  output = output.replace(/{%IMAGE%}/g, pet.image);
  output = output.replace(/{%PRICE%}/g, pet.price);
  output = output.replace(/{%AGE%}/g, pet.age);
  output = output.replace(/{%GREET%}/g, pet.greet);
  output = output.replace(/{%SCREEN%}/g, pet.screen);
  output = output.replace(/{%HEY%}/g, pet.hey);
  output = output.replace(/{%DESCRIPTION%}/g, pet.description);
  output = output.replace(/{%ID%}/g, pet.id);
  return output;
}
