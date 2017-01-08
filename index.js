"use strict";

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const request = require('request-promise');
const httpProxy = require('http-proxy');


const app = next({ dev: true })
const handle = app.getRequestHandler()

const port = process.env.PORT || 3000;
let servers = [];

function getServers() {
  request({ uri: 'http://omegle.com/status', json: true}).then((status) => {
    servers = status.servers;
  })
}

setInterval(() => {
  getServers();
}, 60*1000);

getServers();

const proxy = httpProxy.createProxyServer({});
proxy.on('error', function (err, req, res) {
  console.log(err);
});


app.prepare().then(() => {
  createServer((req, res) => {
    const { pathname, query } = parse(req.url, true)
    const { method } = req.method;
    const { rawHeaders, body , url} = req;

    if (pathname.indexOf('/proxy') !== -1) {
      const rnd = Math.round(Math.random()*7) + 1;
      const server = servers[Math.round(Math.random()*servers.length)];
      if(!server) {
        res.end('');
        return;
      }


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


      const uri = url;
      req.url = req.url.replace('/proxy/', '');
      req.headers = headers;
console.log(req.url);
      proxy.web(req, res, { target: `http://${server}` });
return;
      //console.log(req);


      console.log(uri, query, headers);

      req.on('data', (d) => {
        data.push(d);
      });

      req.on('end', () => {
        request({
          uri,
          method,
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
