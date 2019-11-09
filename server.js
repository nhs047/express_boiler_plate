const express = require('express');
const app = express();
app.use(express.json());
const user = require('./route/user');
const auth = require('./route/auth');

app.use('/api', user);
app.use('/api', auth);
app.get('/', function (req, res) {
    let resString = '<div><h2>Ghuronti API</h2></div>';
    resString+=`<p>Get: (/api/signin) <a href='/api/signin'>Sign In</a></p>`;
    resString+=`<p>Get: (/api/signup) <a href='/api/signup'>Create new user</a></p>`;
    res.send(resString);
  })
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
