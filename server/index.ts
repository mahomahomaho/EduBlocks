import fs = require('fs');
import path = require('path');
import express = require('express');
const expressWs = require('express-ws');
import { spawn, ChildProcess } from 'child_process';
import readline = require('readline');
const bodyParser = require('body-parser');

const homeDirPath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const eduBlocksWorkingPath = path.join(homeDirPath, '.edublocks');

if (!fs.existsSync(eduBlocksWorkingPath)) {
  fs.mkdirSync(eduBlocksWorkingPath);
}

const ui = path.join(__dirname, '..', 'ui');
const runtimeSupportPath = path.join(__dirname, '..', 'runtime_support.py');
const scriptPath = path.join(eduBlocksWorkingPath, 'output.py');
const packagePath = path.join(__dirname, 'package.json');

const version = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;

console.log('Scripts will be written to:', scriptPath);

const app = express();

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

expressWs(app);

let proc: ChildProcess;

let inputFeed: (inp: string) => void;

const clients: EduBlocksClient[] = [];

function writeToAllClients(line: string) {
  clients.forEach(client => {
    client.writeLine(line);
  });
}

let ready = false;

app.post('/runcode', (req, res) => {
  const { code } = req.body;

  const runtimeSupport = fs.readFileSync(runtimeSupportPath);

  const exec = runtimeSupport + code + '\r\n';

  fs.writeFileSync(scriptPath, exec);

  // Kill the last process if it is still running...
  if (proc) {
    ready = false;

    proc.kill('SIGTERM');
  }

  proc = spawn('python3', ['-u', '-i'], { stdio: ['pipe', 'pipe', 'pipe'] });

  console.log(code);

  writeToAllClients('\r\n');

  proc.stdin.write(exec);

  const rl = readline.createInterface({
    input: proc.stdout
  });

  rl.on('line', (input) => {
    if (input.toString().indexOf('Starting...') === 0) {
      ready = true;
    }

    console.log(`LINE: ${input}`);

    if (!ready) return;

    writeToAllClients(input.toString() + '\r\n');
  });

  proc.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);

    if (!ready) return;

    let line = data.toString();

    line = line.replace(/\.\.\.\ /g, '');

    writeToAllClients(line);
  });

  proc.on('close', (code) => {
    if (!ready) return;

    writeToAllClients(`==== Process complete (${code || 'killed'}) ====\r\n`);

    res.send(`Done ${code}`);

    ready = false;
  });

  inputFeed = (inp) => {
    try {
      // Ctrl-C should kill process
      if (inp.length === 1 && inp[0] === String.fromCharCode(3)) {
        proc.kill('SIGTERM');
      } else {
        proc.stdin.write(inp);
      }
    } catch (e) { }
  };
});

app.ws('/terminal', (ws, req: express.Request) => {
  const client: EduBlocksClient = {
    writeLine(line) {
      try {
        ws.send(line);
      } catch (e) { }
    },
  };

  const index = clients.push(client) - 1;

  ws.send(`EduBlocks server version ${version} online and ready`);

  console.log(`Client ${index} connected`);

  ws.on('message', (msg: string) => {
    console.log(`INP: ${msg}`);

    if (inputFeed) {
      inputFeed(msg);
    }
  });

  ws.on('close', () => {
    const index = clients.indexOf(client);

    console.log(`Client ${index} disconnected`);

    clients.splice(index, 1);
  });
});

app.use(express.static(ui));

app.listen(8081, () => {
  console.log('EduBlocks server now listening on port 8081!');
});
