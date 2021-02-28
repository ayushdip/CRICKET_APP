const express = require('express');
const app = express();

app.use('/',express.static(__dirname + '/public'));
app.get('/hello',(req,res)=>{
    res.send('Hello World');
})

app.listen(4444,()=>{
    console.log('Server started at http://localhost:4444');
})