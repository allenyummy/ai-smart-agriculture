var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var FormData = require('form-data');
const csv = require('csvtojson');

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

app.post('/api/predictPretrain', upload.fields([{ name: 'inputFile', maxCount: 1 }]), function(
  req,
  res,
  next
) {
  console.log('/api/predictPretrain');
  console.log(`scripts/AI_Decision_forDefault${req.body.model}Model.py`);
  const { spawnSync } = require('child_process');
  const ls = spawnSync('python3', [
    `scripts/AI_Decision_forDefault${req.body.model}Model.py`,
    'tmp/my-uploads/inputFile',
    '-o',
    'tmp/my-uploads/output.csv'
  ]);
  if (ls.stderr) {
    console.log(Error(ls.stderr));
    process.exitCode = 1;
  }

  res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
  return;
});

app.post(
  '/api/predict',
  upload.fields([{ name: 'inputFile', maxCount: 1 }, { name: 'modelFile', maxCount: 1 }]),
  function(req, res, next) {
    console.log('/api/predict');

    const { spawnSync } = require('child_process');
    const ls = spawnSync('python3', [
      'scripts/AI_Decision_forUploadOwnModel.py',
      'tmp/my-uploads/inputFile',
      'tmp/my-uploads/modelFile',
      '-o',
      'tmp/my-uploads/output.csv'
    ]);

    res.sendFile(path.join(__dirname, '/tmp/my-uploads', 'output.csv'));
  }
);

app.post(
  '/api/clean1',
  upload.fields([{ name: 'sensorData', maxCount: 1 }, { name: 'actuatorData', maxCount: 1 }]),
  async function(req, res, next) {
    const { spawnSync } = require('child_process');
    const ls = spawnSync('python3', [
      'scripts/DataClean-1.py',
      'tmp/my-uploads/sensorData',
      'tmp/my-uploads/actuatorData',
      '-oc',
      'tmp/output/comparison.csv',
      '-ops',
      'tmp/output/pivot_sensorData.csv',
      '-opa',
      'tmp/output/pivot_actuatorData.csv'
    ]);

    let jsonObjArr = new Array(3);
    jsonObjArr[0] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'comparison.csv'),
      'utf-8'
    );
    jsonObjArr[1] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'pivot_sensorData.csv'),
      'utf-8'
    );
    jsonObjArr[2] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'pivot_actuatorData.csv'),
      'utf-8'
    );
    // await Promise.all(jsonObjArr);
    res.send(jsonObjArr);
  }
);

app.post(
  '/api/clean2',
  upload.fields([{ name: 'sensorData', maxCount: 1 }, { name: 'actuatorData', maxCount: 1 }]),
  async function(req, res, next) {
    const { spawnSync } = require('child_process');
    console.log('/api/clean2');
    const ls = spawnSync('python3', [
      'scripts/DataClean-2.py',
      'tmp/my-uploads/sensorData',
      'tmp/my-uploads/actuatorData',
      '-os',
      'tmp/output/outputsensor.csv',
      '-om',
      'tmp/output/outputMerge.csv'
    ]);

    let jsonObjArr = new Array(2);
    jsonObjArr[0] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'outputsensor.csv'),
      'utf-8'
    );
    jsonObjArr[1] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'outputMerge.csv'),
      'utf-8'
    );
    // await Promise.all(jsonObjArr);
    res.send(jsonObjArr);
  }
);

app.post(
  '/api/clean3',
  upload.fields([{ name: 'merge_irregular_time_data', maxCount: 1 }]),
  async function(req, res, next) {
    console.log('/api/clean3');
    const { spawnSync } = require('child_process');
    const ls = spawnSync('python3', [
      'scripts/DataClean-3.py',
      'tmp/my-uploads/merge_irregular_time_data',
      '-om',
      'tmp/output/merge_regular_time.csv',
      '-os1',
      'tmp/output/output_statistics1.csv',
      '-os2',
      'tmp/output/output_statistics2.csv'
    ]);

    let jsonObjArr = new Array(3);
    jsonObjArr[0] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'merge_regular_time.csv'),
      'utf-8'
    );
    jsonObjArr[1] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'output_statistics1.csv'),
      'utf-8'
    );
    jsonObjArr[2] = fs.readFileSync(
      path.join(__dirname, '/tmp/output/', 'output_statistics2.csv'),
      'utf-8'
    );
    // await Promise.all(jsonObjArr);
    res.send(jsonObjArr);
  }
);

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
