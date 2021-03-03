const express = require('express');
const app = express();
const SERVER_PORT = process.env.PORT || 4444
app.use('/',express.static(__dirname + '/public'));

app.get('/hello',(req,res)=>{
    res.send('Hello World');
})


app.listen(SERVER_PORT,()=>{
    console.log('Server started at http://localhost:4444');
})