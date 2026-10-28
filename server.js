// @ts-check
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn, exec } = require('node:child_process');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Assurer l'existence du dossier data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const MEMORY_FILE = path.join(DATA_DIR, 'memory.md');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');
const LIBRARY_FILE = path.join(DATA_DIR, 'library.json');

// Fichiers de mémoire synchronisés depuis la mémoire centrale (data/memory.md)
// - AGENTS.md : lu par OpenCode ET Codex CLI (conventions de projet)
// - GEMINI.md : lu par Antigravity CLI (Gemini)
// (CLAUDE.md est obsolète : Claude Code a été remplacé par OpenCode, qui lit AGENTS.md en priorité.)
const MEMORY_SYNC_TARGETS = ['AGENTS.md', 'GEMINI.md'];

// Initialiser les fichiers de données si nécessaire
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(MEMORY_FILE)) {
  const defaultMemory = `# Contexte et conventions Hivemind

- Projet : Hivemind (application locale d'orchestration multi-CLI IA)
- Environnement : Windows, Node.js v22, Localhost
- Architecture : 100 % local, sous-processus CLI sans API externe payante
- CLI cibles : OpenCode (DeepSeek), Codex CLI, Antigravity CLI
- Conventions de code : Zéro code manuel (généré par IA), relecture humaine systématique
- Fichiers de mémoire synchronisés : AGENTS.md (OpenCode + Codex), GEMINI.md (Antigravity)
`;
  fs.writeFileSync(MEMORY_FILE, defaultMemory, 'utf-8');
}
if (!fs.existsSync(USAGE_FILE)) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify({ date: new Date().toISOString().slice(0, 10), counts: { agy: 0, codex: 0, opencode: 0 } }, null, 2), 'utf-8');
}
if (!fs.existsSync(LIBRARY_FILE)) {
  const defaultPrompts = [
    { id: '1', title: 'Relecture et critique de code', prompt: 'Relis ce code, vérifie la sécurité, la gestion des erreurs sous Windows et propose des améliorations concrètes :' },
    { id: '2', title: 'Génération de tests unitaires', prompt: 'Génère les tests automatisés pour cette fonctionnalité en couvrant les cas limites :' },
    { id: '3', title: 'Synthèse d\'architecture', prompt: 'Fais une synthèse claire et concise des dépendances et flux de données pour ce composant :' },
    { id: '4', title: 'Vérification de la mémoire commune', prompt: 'Quelles sont les conventions du projet définies dans la mémoire de démarrage ?' }
  ];
  fs.writeFileSync(LIBRARY_FILE, JSON.stringify(defaultPrompts, null, 2), 'utf-8');
}

// Suivi des processus en cours d'exécution pour annulation
const activeProcesses = new Map();

// Helper JSON read / write
function readJson(file, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// Mise à jour du compteur d'usage quotidien
function incrementUsage(cli) {
  const today = new Date().toISOString().slice(0, 10);
  let usage = readJson(USAGE_FILE, { date: today, counts: {} });
  if (usage.date !== today) {
    usage = { date: today, counts: { agy: 0, codex: 0, opencode: 0 } };
  }
  usage.counts[cli] = (usage.counts[cli] || 0) + 1;
  writeJson(USAGE_FILE, usage);
  return usage;
}

// Détection des CLI
async function detectCLIs() {
  const check = (cmd) => new Promise((resolve) => {
    exec(cmd, { timeout: 4000 }, (err, stdout, stderr) => {
      if (err) {
        resolve({ available: false, version: null, error: (stderr || err.message).trim() });
      } else {
        resolve({ available: true, version: (stdout || '').trim(), error: null });
      }
    });
  });

  const [opencode, codex, agy] = await Promise.all([
    check('opencode --version'),
    check('codex --version'),
    check('agy --version')
  ]);

  return { opencode, codex, agy };
}

// Traiter les messages d'erreur en français clair (HM-12)
function formatFrenchError(cliName, rawError) {
  const err = (rawError || '').toLowerCase();
  if (err.includes('could not load google cloud credentials') || err.includes('credentials') || err.includes('auth')) {
    return `Erreur d'authentification pour ${cliName}. Vos identifiants ou quotas d'abonnement sont manquants ou expirés. Connectez-vous avec votre propre compte dans votre terminal.`;
  }
  if (err.includes('nested') || err.includes('sessions imbriquées') || err.includes('refuse de démarrer')) {
    return `Session imbriquée détectée. Lancez Hivemind directement depuis votre terminal Windows hôte (pas via un sous-agent).`;
  }
  if (err.includes('not recognized') || err.includes('introuvable') || err.includes('not found') || err.includes('enoent')) {
    return `La commande "${cliName}" n'a pas été trouvée dans votre PATH système. Vérifiez son installation sur ce poste.`;
  }
  if (err.includes('quota') || err.includes('rate limit') || err.includes('429')) {
    return `Le quota d'abonnement pour ${cliName} a été atteint. Basculez sur une autre CLI (OpenCode, Codex ou Antigravity).`;
  }
  return `Erreur d'exécution de ${cliName} : ${rawError || 'Processus arrêté avec un code d\'erreur.'}`;
}

// Kill processus et ses enfants sous Windows
function killProcess(pid) {
  try {
    exec(`taskkill /pid ${pid} /T /F`);
  } catch (e) {
    // ignore
  }
}

// Définition du lancement des 3 CLI (OpenCode + DeepSeek, Codex, Antigravity)
// - output "text" : stdout brut directement exploitable comme réponse.
// - output "json" : NDJSON produit par `opencode run --format json` (un objet par ligne).
const CLI_LAUNCH = {
  agy: {
    command: 'agy',
    args: (prompt) => ['-p', prompt],
    output: 'text'
  },
  codex: {
    command: 'cmd.exe',
    args: (prompt) => ['/c', 'codex', 'exec', '--ephemeral', prompt],
    output: 'text'
  },
  opencode: {
    command: 'cmd.exe',
    args: (prompt) => ['/c', 'opencode', 'run', '--format', 'json', prompt],
    output: 'json'
  }
};

// Extrait le texte de réponse d'une ligne NDJSON émise par `opencode run --format json`.
function extractOpenCodeText(line) {
  const trimmed = (line || '').trim();
  if (!trimmed) return '';
  try {
    const evt = JSON.parse(trimmed);
    if (evt && evt.type === 'text' && evt.part && typeof evt.part.text === 'string') {
      return evt.part.text;
    }
  } catch (e) {
    // Ligne non-JSON (avertissement éventuel) : ignorée pour la réponse.
  }
  return '';
}

// Synchronise la mémoire centrale (data/memory.md) vers les fichiers lus par chaque CLI.
function syncMemory({ targetDir = ROOT_DIR, force = false } = {}) {
  const dir = fs.existsSync(targetDir) ? targetDir : ROOT_DIR;
  const memoryContent = fs.existsSync(MEMORY_FILE) ? fs.readFileSync(MEMORY_FILE, 'utf-8') : '';
  const targets = MEMORY_SYNC_TARGETS;
  const existingOverwrites = [];

  for (const file of targets) {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath) && !force) {
      const current = fs.readFileSync(filePath, 'utf-8');
      if (current.trim() !== memoryContent.trim() && current.trim().length > 0) {
        existingOverwrites.push(file);
      }
    }
  }

  // Si des fichiers existants diffèrent et force n'est pas activé, avertir l'utilisateur (critère HM-07)
  if (existingOverwrites.length > 0 && !force) {
    return {
      warning: true,
      conflicts: existingOverwrites,
      message: `Des fichiers existants (${existingOverwrites.join(', ')}) contiennent des modifications manuelles. Confirmez pour synchroniser.`
    };
  }

  const synced = [];
  for (const file of targets) {
    const filePath = path.join(dir, file);
    fs.writeFileSync(filePath, memoryContent, 'utf-8');
    synced.push(filePath);
  }

  return {
    success: true,
    synced,
    message: `Synchronisation réussie dans ${dir} (${targets.join(', ')})`
  };
}

// Serveur HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // En-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTES ---

  // 1. Détection des CLI et statut global
  if (pathname === '/api/status' && req.method === 'GET') {
    const clis = await detectCLIs();
    const today = new Date().toISOString().slice(0, 10);
    const usage = readJson(USAGE_FILE, { date: today, counts: { agy: 0, codex: 0, opencode: 0 } });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      clis,
      usage,
      defaultWorkdir: ROOT_DIR
    }));
    return;
  }

  // 2. Annulation de requête en cours (HM-10)
  if (pathname === '/api/cancel' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { requestId } = JSON.parse(body || '{}');
        if (requestId && activeProcesses.has(requestId)) {
          const proc = activeProcesses.get(requestId);
          killProcess(proc.pid);
          activeProcesses.delete(requestId);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Requête annulée' }));
        } else {
          // Annuler tous les processus actifs si pas d'ID
          for (const [id, proc] of activeProcesses.entries()) {
            killProcess(proc.pid);
            activeProcesses.delete(id);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Toutes les requêtes actives ont été annulées' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 3. Exécution d'un prompt avec streaming SSE (HM-01, HM-02, HM-09, HM-10)
  if (pathname === '/api/prompt' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let params;
      try {
        params = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON invalide' }));
        return;
      }

      const { cli, prompt, workdir = ROOT_DIR, requestId = String(Date.now()) } = params;

      if (!cli || !prompt) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'CLI et prompt requis' }));
        return;
      }

      // Configuration SSE
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const sendEvent = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      const startTime = Date.now();
      let fullResponse = '';
      let rawError = '';

      let command = '';
      let args = [];

      const cwd = fs.existsSync(workdir) ? workdir : ROOT_DIR;

      const launch = CLI_LAUNCH[cli];
      if (!launch) {
        sendEvent('error', { message: `CLI inconnue : ${cli}` });
        res.end();
        return;
      }
      command = launch.command;
      args = launch.args(prompt);

      sendEvent('start', { requestId, cli, cwd });

      let proc;
      try {
        proc = spawn(command, args, { cwd, shell: false });
        activeProcesses.set(requestId, proc);
        // Fermer stdin pour éviter tout blocage interactif
        if (proc.stdin) {
          proc.stdin.end();
        }
      } catch (err) {
        sendEvent('error', { message: formatFrenchError(cli, err.message) });
        res.end();
        return;
      }

      // Tampon pour le flux NDJSON d'OpenCode (une ligne = un événement JSON)
      let stdoutBuffer = '';

      proc.stdout.on('data', (chunk) => {
        if (launch.output === 'json') {
          stdoutBuffer += chunk.toString();
          const lines = stdoutBuffer.split(/\r?\n/);
          stdoutBuffer = lines.pop() || '';
          for (const line of lines) {
            const text = extractOpenCodeText(line);
            if (text) {
              fullResponse += text;
              sendEvent('chunk', { text });
            }
          }
        } else {
          const text = chunk.toString();
          fullResponse += text;
          sendEvent('chunk', { text });
        }
      });

      proc.stderr.on('data', (chunk) => {
        const text = chunk.toString();
        // Certaines CLI écrivent des infos sur stderr (ex: tokens, warnings)
        rawError += text;
        sendEvent('stderr', { text });
      });

      proc.on('error', (err) => {
        activeProcesses.delete(requestId);
        const frenchMsg = formatFrenchError(cli, err.message);
        sendEvent('error', { message: frenchMsg });
        res.end();
      });

      proc.on('close', (code) => {
        activeProcesses.delete(requestId);

        // Vider le tampon NDJSON résiduel d'OpenCode avant de finaliser la réponse
        if (launch.output === 'json' && stdoutBuffer.trim()) {
          const text = extractOpenCodeText(stdoutBuffer);
          if (text) {
            fullResponse += text;
          }
        }

        const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

        let finalResponse = fullResponse.trim();
        let isError = code !== 0 && !finalResponse;

        if (isError) {
          const frenchMsg = formatFrenchError(cli, rawError || `Code de sortie ${code}`);
          sendEvent('error', { message: frenchMsg, code, duration: durationSec });
        } else {
          // Si du texte a été émis, c'est un succès exploitable
          sendEvent('done', { response: finalResponse, duration: durationSec });
          incrementUsage(cli);
        }

        // Sauvegarde dans l'historique (HM-03)
        const history = readJson(HISTORY_FILE, []);
        const entry = {
          id: requestId,
          timestamp: new Date().toISOString(),
          cli,
          prompt,
          response: finalResponse || (isError ? formatFrenchError(cli, rawError) : ''),
          duration: `${durationSec}s`,
          workdir: cwd,
          success: !isError
        };
        history.unshift(entry);
        // Conserver les 200 derniers échanges
        writeJson(HISTORY_FILE, history.slice(0, 200));

        res.end();
      });
    });
    return;
  }

  // 4. Historique des échanges (HM-03, HM-18)
  if (pathname === '/api/history' && req.method === 'GET') {
    const q = (parsedUrl.searchParams.get('q') || '').toLowerCase();
    let history = readJson(HISTORY_FILE, []);
    if (q) {
      history = history.filter(item => 
        (item.prompt && item.prompt.toLowerCase().includes(q)) ||
        (item.response && item.response.toLowerCase().includes(q)) ||
        (item.cli && item.cli.toLowerCase().includes(q))
      );
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(history));
    return;
  }

  if (pathname === '/api/history' && req.method === 'DELETE') {
    writeJson(HISTORY_FILE, []);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 5. Mémoire centrale éditable (HM-06)
  if (pathname === '/api/memory' && req.method === 'GET') {
    const content = fs.existsSync(MEMORY_FILE) ? fs.readFileSync(MEMORY_FILE, 'utf-8') : '';
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ content }));
    return;
  }

  if (pathname === '/api/memory' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { content } = JSON.parse(body);
        fs.writeFileSync(MEMORY_FILE, content || '', 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Mémoire centrale enregistrée' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 6. Synchronisation de la mémoire vers AGENTS.md (OpenCode + Codex) et GEMINI.md (Antigravity) (HM-07)
  if (pathname === '/api/memory/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { targetDir = ROOT_DIR, force = false } = JSON.parse(body || '{}');
        const result = syncMemory({ targetDir, force });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 7. Bibliothèque de prompts (HM-17)
  if (pathname === '/api/library' && req.method === 'GET') {
    const library = readJson(LIBRARY_FILE, []);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(library));
    return;
  }

  if (pathname === '/api/library' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { title, prompt } = JSON.parse(body);
        if (!title || !prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Titre et prompt requis' }));
          return;
        }
        const library = readJson(LIBRARY_FILE, []);
        const newEntry = { id: String(Date.now()), title, prompt };
        library.push(newEntry);
        writeJson(LIBRARY_FILE, library);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, item: newEntry }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (pathname.startsWith('/api/library/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/library/', '');
    let library = readJson(LIBRARY_FILE, []);
    library = library.filter(p => p.id !== id);
    writeJson(LIBRARY_FILE, library);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 8. Fichiers statiques (public/)
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Sécurité traversée de chemin
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Accès interdit');
    return;
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Fichier non trouvé');
  }
});

function startServer(port) {
  server.listen(port, '127.0.0.1', () => {
    console.log(`====================================================`);
    console.log(`  Hivemind v1.0.0 est opérationnel !`);
    console.log(`  Adresse locale : http://127.0.0.1:${port}`);
    console.log(`  Mode : 100% Localhost Windows (Zero API payante)`);
    console.log(`====================================================`);
  }).on('error', (err) => {
    // @ts-ignore
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} occupé, bascule sur le port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Erreur serveur :', err);
    }
  });
}

if (require.main === module) {
  startServer(PORT);
}

module.exports = {
  CLI_LAUNCH,
  MEMORY_SYNC_TARGETS,
  detectCLIs,
  extractOpenCodeText,
  formatFrenchError,
  syncMemory,
  buildPromptCommand: (cli, prompt) => {
    const launch = CLI_LAUNCH[cli];
    if (!launch) return null;
    return { command: launch.command, args: launch.args(prompt), output: launch.output };
  }
};
