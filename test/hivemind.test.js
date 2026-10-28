// @ts-check
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  CLI_LAUNCH,
  MEMORY_SYNC_TARGETS,
  detectCLIs,
  extractOpenCodeText,
  syncMemory,
  buildPromptCommand
} = require('../server.js');

// ============================================================
// 1. Configuration : exactement 3 agents (OpenCode, Codex, Antigravity)
// ============================================================

test('les 3 CLI sont définies : opencode, codex, agy', () => {
  const ids = Object.keys(CLI_LAUNCH).sort();
  assert.deepEqual(ids, ['agy', 'codex', 'opencode']);
});

test("aucune trace de l'ancienne CLI claude dans les définitions", () => {
  assert.equal(CLI_LAUNCH.claude, undefined);
  assert.equal(CLI_LAUNCH[Object.keys(CLI_LAUNCH).find((k) => k === 'claude')], undefined);
});

test('la commande de lancement OpenCode utilise `opencode run --format json`', () => {
  const cmd = buildPromptCommand('opencode', 'bonjour');
  assert.ok(cmd);
  assert.equal(cmd.command, 'cmd.exe');
  const args = cmd.args.join(' ');
  assert.ok(args.includes('opencode'), 'contient la commande opencode');
  assert.ok(args.includes('run'), 'contient la sous-commande run');
  assert.ok(args.includes('--format'), 'contient --format');
  assert.ok(args.includes('json'), 'contient json');
  assert.ok(args.includes('bonjour'), 'contient le prompt');
  assert.equal(cmd.output, 'json');
});

test('la commande Codex reste `codex exec --ephemeral`', () => {
  const cmd = buildPromptCommand('codex', 'bonjour');
  assert.ok(cmd);
  assert.ok(cmd.args.join(' ').includes('codex'));
  assert.ok(cmd.args.join(' ').includes('exec'));
  assert.ok(cmd.args.join(' ').includes('--ephemeral'));
  assert.equal(cmd.output, 'text');
});

test('la commande Antigravity reste `agy -p`', () => {
  const cmd = buildPromptCommand('agy', 'bonjour');
  assert.ok(cmd);
  assert.equal(cmd.command, 'agy');
  assert.deepEqual(cmd.args, ['-p', 'bonjour']);
  assert.equal(cmd.output, 'text');
});

test('buildPromptCommand renvoie null pour une CLI inconnue', () => {
  assert.equal(buildPromptCommand('claude', 'bonjour'), null);
  assert.equal(buildPromptCommand('inconnue', 'bonjour'), null);
});

// ============================================================
// 2. Extraction du texte de réponse OpenCode (flux NDJSON)
// ============================================================

test('extractOpenCodeText extrait le texte d\'un événement "text"', () => {
  const line = JSON.stringify({
    type: 'text',
    part: { type: 'text', text: 'Bonjour !' }
  });
  assert.equal(extractOpenCodeText(line), 'Bonjour !');
});

test('extractOpenCodeText ignore step_start / step_finish', () => {
  assert.equal(extractOpenCodeText('{"type":"step_start","part":{"type":"step-start"}}'), '');
  assert.equal(extractOpenCodeText('{"type":"step_finish","part":{"type":"step-finish"}}'), '');
});

test('extractOpenCodeText ignore les lignes non-JSON ou vides', () => {
  assert.equal(extractOpenCodeText(''), '');
  assert.equal(extractOpenCodeText('   '), '');
  assert.equal(extractOpenCodeText('ligne non json'), '');
});

// ============================================================
// 3. Mémoire commune (HM-07) : AGENTS.md + GEMINI.md
// ============================================================

test('les cibles de synchronisation sont AGENTS.md et GEMINI.md', () => {
  assert.deepEqual(MEMORY_SYNC_TARGETS, ['AGENTS.md', 'GEMINI.md']);
});

test('syncMemory écrit la mémoire commune dans les fichiers cibles', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hivemind-test-'));
  try {
    const result = syncMemory({ targetDir: dir, force: true });
    assert.equal(result.success, true);

    const memoryContent = fs.readFileSync(path.join(__dirname, '..', 'data', 'memory.md'), 'utf-8');
    for (const file of MEMORY_SYNC_TARGETS) {
      const filePath = path.join(dir, file);
      assert.ok(fs.existsSync(filePath), `${file} doit exister`);
      assert.equal(fs.readFileSync(filePath, 'utf-8'), memoryContent, `${file} doit contenir la mémoire commune`);
    }
    // CLAUDE.md ne doit plus être produit (Claude Code remplacé par OpenCode)
    assert.equal(fs.existsSync(path.join(dir, 'CLAUDE.md')), false, 'CLAUDE.md ne doit plus être synchronisé');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('syncMemory avertit avant d\'écraser un fichier modifié manuellement', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hivemind-test-'));
  try {
    const filePath = path.join(dir, 'AGENTS.md');
    fs.writeFileSync(filePath, 'Contenu manuel existant', 'utf-8');

    const result = syncMemory({ targetDir: dir, force: false });
    assert.equal(result.warning, true);
    assert.deepEqual(result.conflicts, ['AGENTS.md']);
    // Le contenu manuel n'est pas écrasé sans force
    assert.equal(fs.readFileSync(filePath, 'utf-8'), 'Contenu manuel existant');

    const forced = syncMemory({ targetDir: dir, force: true });
    assert.equal(forced.success, true);
    const memoryContent = fs.readFileSync(path.join(__dirname, '..', 'data', 'memory.md'), 'utf-8');
    assert.equal(fs.readFileSync(filePath, 'utf-8'), memoryContent);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ============================================================
// 4. Lancement des 3 agents (détection via --version)
// ============================================================

test('les 3 CLI sont détectées comme disponibles', { timeout: 30000 }, async () => {
  const clis = await detectCLIs();

  assert.ok(clis.opencode, 'opencode doit être détecté');
  assert.ok(clis.codex, 'codex doit être détecté');
  assert.ok(clis.agy, 'agy doit être détecté');

  assert.equal(clis.opencode.available, true, `opencode indisponible : ${clis.opencode.error || '?'}`);
  assert.equal(clis.codex.available, true, `codex indisponible : ${clis.codex.error || '?'}`);
  assert.equal(clis.agy.available, true, `agy indisponible : ${clis.agy.error || '?'}`);
});
