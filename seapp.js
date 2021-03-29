
const express = require('express');
const mongoose = require('mongoose');

const bp = require('body-parser').json;
const cp = require('cookie-parser');

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const CONFIG = yaml.parse(fs.readFileSync(path.resolve(__dirname,'config.yaml'),'utf-8'));

const app = express();

app.use(bp());
app.use(cp());

app.get('/', async (req,res) => { res.send('SENDSOME server'); });
app.use(require('./controllers/_router'));

async function main() {

    await mongoose.connect(`${CONFIG.DB}${CONFIG.DBNAME}`, { useNewUrlParser : true,  useUnifiedTopology : true });
    app.listen(CONFIG.PORT, () => { console.log(`On port ${CONFIG.PORT}`) });

}

main();
