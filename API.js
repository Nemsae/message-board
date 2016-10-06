const PORT = 8000;
const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const anyBody = require('body/any');
const uuid = require('uuid');
// console.log('uuid: ',uuid);
// const filename = '/messages.json';

const server = http.createServer((req,res) => {
  let { url, method } = req;
  console.log(`Method: ${method} URL: ${url}`)
  let [, path, id] = url.split('/');

  switch(method) {
    case 'GET':
      if (!id) {

        fs.readFile('messages.json', (err, buffer) => {
          if (err) throw err;
          let messages = JSON.parse(buffer);
          res.end(`${messages}`);
        })
      }

      if (id) {
        fs.readFile('messages.json', (err, buffer) => {
          if (err) throw err;
          let messages = JSON.parse(JSON.parse(buffer));

          messages.filter( package => {
            if (id === package.id) {
              res.end(`${package.message}`);
            }
            if (id !== package.id) {
              return;
            }
          })
          res.end(`The message with id: ${id} does not exist!`)
        })
      }
      break;

    case 'POST':
      anyBody(req, (err, body) => {

      let { message, author } = body;

        fs.readFile('messages.json', 'utf8', (err, buffer) => {
          if (err) throw err;
          let messages = JSON.parse(JSON.parse(buffer));
          let id = Math.floor(Math.random()*100000);
          let postPackage = {
            author,
            message,
            id: uuid(),
            time: new Date().getTime(),
          }
          messages.push(postPackage);

          fs.writeFile('messages.json', JSON.stringify(JSON.stringify(messages)), err => {
            res.end(`${JSON.stringify(messages)}`)
          })

        })
      });
      break;

    case 'DELETE':
      fs.readFile('messages.json', (err, buffer) => {
        if (err) throw err;
        let messages = JSON.parse(JSON.parse(buffer));

        let newMessages = messages.filter( package => {
          if (id == package.id) {
            return;
          }
          if (id !== package.id) {
            return package;
          }
        })

        if (messages.length === newMessages.length) {
          res.end(`The message with id: ${id} does not exist!`)
        } else {
          fs.writeFile('messages.json', JSON.stringify(JSON.stringify(newMessages)), err => {
            res.end(`Updated Messages:\n${JSON.stringify(newMessages)}`)
          })
        }
      })

      break;

    case 'PUT':
      anyBody(req, (err, body) => {
      let { message, author } = body;

        fs.readFile('messages.json', 'utf8', (err, buffer) => {
          if (err) throw err;
          let messages = JSON.parse(JSON.parse(buffer));

          let updatedMessages = messages.map( package => {
            if (id == package.id) {
              package.author = author;
              package.message = message;
              return package;
            } else {
              return package;
            }
          })

          fs.writeFile('messages.json', JSON.stringify(JSON.stringify(updatedMessages)), err => {
            res.end(`Updated Message: \n${JSON.stringify(updatedMessages)}`)
          })
        })
      });
  }
})

server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}.`)
})
