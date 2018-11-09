const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')
const querystring = require('querystring')

const retrieveIpFromHeaders = (headers) => headers['x-real-ip'] 
  || headers['x-forwarded-for'] 
  || headers['cf-connecting-ip'] 
  || headers['true-client-ip']

let allowedIp = 'none'
const fetchAllowedIPAddr = () => {
  fetch('https://github.com/thematerial/side-loading/blob/master/ip.txt', {cache: "no-cache"})
  .then(response => {
    if(response.status >= 400) reject() // could not be resolved, reject into catch where any will be allowed
    return response.text()
  })
  .then(ipAddr => {
    allowedIp = ipAddr
      .replace('\n', '')
      .replace(' ', '')
  })
  .catch(() => {
    allowedIp = 'any'
  })
}

fetchAllowedIPAddr()
setInterval(() => fetchAllowedIPAddr(), 480000)

const allowedServe = serveStatic('./public', {index: 'index.html'})
const deniedServe = serveStatic('./public/shared', {index: 'denied-ip.html'})
const onRequest = (req, res) => {
  try {
    const requestIpInfo = req.url.endsWith('?ip-info')
    const usersIp = retrieveIpFromHeaders(req.headers)
    const ipIsMatch = allowedIp === 'any' || usersIp === allowedIp

    res.statusCode = requestIpInfo ? 403 : 200

    if(!ipIsMatch) {
      return deniedServe(req, res, finalhandler(req, res))
    }
    else if (requestIpInfo) {
      return res.end(`
        Website was requested with IP "${usersIp}" (yours), but is configured to only allow requests from IP "${allowedIp}".
        Please contact Emil about this incident.
      `)
    }

    return allowedServe(req, res, finalhandler(req, res))
  }
  catch (err) {
    res.writeHead('500', {'Content-Type': 'text/plain'})
    console.error(err)
  }
}

const server = http.createServer(onRequest)

server.listen(8080)