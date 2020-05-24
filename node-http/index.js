const http = require('http')
const fs = require('fs')
const path = require('path')


const hostname = 'localhost'
const port = 3000

const server = http.createServer((req,res) =>{

console.log('Request for'+ req.url + ' by method ' + req.method)

if(req.method == 'GET'){
  var fileUrl;
  if (req.url == '/') fileUrl = '/index.html';
  else fileUrl = req.url;

  var filePath = path.resolve('./public'+fileurl)
  const fileExt = path.extname(filePath)
  if(fileExt == '.html'){
    fs.exists(filePath )
  }
}
else{

}
})

server.listen(port,hostname,()=>{
  console.log('server listening on port 3000')
})