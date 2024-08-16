const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5007;


const app = express();
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());











app.get('/', async (req, res) =>{

res.send('start server')

});

app.listen(port, ()=>{

console.log('Job Task 2 server is running on:', port)

});