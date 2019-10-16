# AI Smart Agriculture Web

### Requirement

npm >= 6.9.0
node >= v12.5.0

### Usage

```
git clone git@github.com:kerorojason/ai-smart-agriculture.git
cd ai-smart-agriculture
npm install
npm run dev
```

This will run a server on http://localhost:5000 and an app server on http://localhost:3000 which will proxy api requests to http://localhost:5000

### Install with Docker 

```
docker pull kerorojason/ai-smart-agriculture
docker run -p 5000:5000 kerorojason/ai-smart-agriculture
```
