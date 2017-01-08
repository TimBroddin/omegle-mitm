"use strict";

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const request = require('request-promise');
var bodyParser = require('body-parser');

const app = next({ dev: true })
const handle = app.getRequestHandler()

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const { pathname, query } = parse(req.url, true)
    const { method } = req.method;
    const { rawHeaders, body } = req;

    if (pathname.indexOf('/proxy') !== -1) {
      const rnd = Math.round(Math.random()*7) + 1;
      const uri = `http://front${rnd}.omegle.com${pathname.replace('/proxy', '')}`;

      //console.log(req);

      let headers = {};
      let data = [];
      for(let i=0;i<rawHeaders.length;i+=2) {

        headers[rawHeaders[i]] = rawHeaders[i+1];
      }

      delete headers['Origin'];
      delete headers['Referer'];
      delete headers['X-Request-Id'];

      delete headers['X-Forwarded-For'];
      delete headers['X-Forwarded-Proto'];
      delete headers['X-Forwarded-Port'];
      delete headers['Via'];
      delete headers['Connect-Time'];
      delete headers['X-Request-Start'];
      delete headers['Total-Route-Time'];
      delete headers['Host'];

      headers['Connection'] = 'keep-alive';

      console.log(uri, query, headers);

      req.on('data', (d) => {
        data.push(d);
      });

      req.on('end', () => {
        request({
          uri,
          method,
          qs: query,
          headers,
          body: (data) ? data.toString('utf8') : null
        }).then((response) => {
          console.log(response);
          res.end(response);
        }).catch((err) => {
          console.log(uri, err.message, data.toString('utf8'));
        });
      });


    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res)
    }
  })
  .listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})


/*

let c1 = new Conversation();
let c2 = new Conversation();

c1.on('message', (txt) => {
    console.log(`[PERSON 1] ${txt}`);
    c2.sendMessage(txt);
})

c2.on('message', (txt) => {
    console.log(`[PERSON 2] ${txt}`);
    c1.sendMessage(txt);
});

c1.on('typing', () => {
    c2.sendTyping();
});

c2.on('typing', () => {
    c1.sendTyping();
});

c1.on('disconnect', () => {
    console.log('[PERSON 1] Disconnect');
    c1.start();
    c2.start();
});

c2.on('disconnect', () => {
    console.log('[PERSON 2] Disconnect');

    c1.start();
    c2.start();
});

c1.start();
c2.start();

*/
