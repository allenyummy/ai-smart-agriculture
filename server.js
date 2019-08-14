var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'tmp/my-uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname);
  }
});
var upload = multer({ storage: storage });

var app = express();
app.post(
  '/api/predict',
  upload.fields([{ name: 'inputFile', maxCount: 1 }, { name: 'modelFile', maxCount: 1 }]),
  function(req, res, next) {
    const { spawnSync } = require('child_process');
    const ls = spawnSync('python', [
      'scripts/AI_Decision.py',
      'tmp/my-uploads/inputFile',
      'tmp/my-uploads/modelFile',
      '-otmp/my-uploads/output.csv'
    ]);
    let form = new FormData();
    form.append('outputFile', fs.createReadStream('tmp/my-uploads/output.csv'));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="output.csv"');
    res.send(form);
  }
);

app.get('/api/predict', function(req, res) {
  res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
});

app.get('/api/test', async function(req, res) {
  let readStream = fs.createReadStream('tmp/my-uploads/output.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="output.csv"');
  // res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
  readStream.on('open', function() {
    readStream.pipe(res);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(5000, function() {
  console.log('Server running on ' + '(http://localhost:' + 5000 + ')');
});
