var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
// var FormData = require('form-data');

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

app.post('/api/predictPretrain', upload.fields([{ name: 'inputFile', maxCount: 1 }]), function(req, res, next) {
  console.log('/api/predictPretrain');
  console.log(`scripts/AI_Decision_forDefault${req.body.model}Model.py`);
  const { spawnSync } = require('child_process');
  const ls = spawnSync('python', [
    `scripts/AI_Decision_forDefaultRFModel.py`,
    'tmp/my-uploads/inputFile',
    '-otmp/my-uploads/output.csv'
  ]);
  res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
});

app.post(
  '/api/predict',
  upload.fields([{ name: 'inputFile', maxCount: 1 }, { name: 'modelFile', maxCount: 1 }]),
  function(req, res, next) {
    console.log('/api/predict');

    const { spawnSync } = require('child_process');
    const ls = spawnSync('python', [
      'scripts/AI_Decision.py',
      'tmp/my-uploads/inputFile',
      'tmp/my-uploads/modelFile',
      '-otmp/my-uploads/output.csv'
    ]);
    res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Server running on ' + '(http://localhost:' + PORT + ')');
});
