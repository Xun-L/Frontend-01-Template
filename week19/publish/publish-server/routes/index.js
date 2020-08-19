var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.post('/', function (req, res, next) {

  req.on('data', (buff) => {
    console.log('data')
    console.log(buff);
  });
  req.on('end', (buff) => {
    console.log('end');
  });
  fs.writeFileSync('../server/public/' + req.query.filename, req.body.content);
  //res.render('index', { title: 'Express' });
  res.send('ok');
});

module.exports = router;
