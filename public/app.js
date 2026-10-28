// @ts-check
/**
 * Hivemind — Frontend Application (public/app.js)
 * Orchestrateur Multi-CLI IA local (OpenCode + DeepSeek, Codex CLI, Antigravity CLI)
 * Implémentation complète : HM-01 à HM-20
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ÉLÉMENTS DU DOM
  // ==========================================

  // En-tête : Badges & Dossier de travail
  const badgeAgy = document.getElementById('badge-agy');
  const badgeCodex = document.getElementById('badge-codex');
  const badgeOpencode = document.getElementById('badge-opencode');
  const workdirInput = /** @type {HTMLInputElement} */ (document.getElementById('workdirInput'));

  // En-tête : Compteurs d'usage du jour & Thème
  const cntAgy = document.getElementById('cnt-agy');
  const cntCodex = document.getElementById('cnt-codex');
  const cntOpencode = document.getElementById('cnt-opencode');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // Navigation par onglets
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Onglet 1 : Console & Prompt (HM-01, HM-02, HM-09, HM-10, HM-11)
  const cliSelect = /** @type {HTMLSelectElement} */ (document.getElementById('cliSelect'));
  const quickLibrarySelect = /** @type {HTMLSelectElement} */ (document.getElementById('quickLibrarySelect'));
  const clearPromptBtn = document.getElementById('clearPromptBtn');
  const promptInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('promptInput'));
  const requestStatus = document.getElementById('requestStatus');
  const statusText = document.getElementById('statusText');
  const statusTimer = document.getElementById('statusTimer');
  const cancelBtn = document.getElementById('cancelBtn');
  const sendBtn = /** @type {HTMLButtonElement} */ (document.getElementById('sendBtn'));

  const responseCliTag = document.getElementById('responseCliTag');
  const responseTime = document.getElementById('responseTime');
  const copyResponseBtn = document.getElementById('copyResponseBtn');
  const relayBtn = document.getElementById('relayBtn');
  const exportMdBtn = document.getElementById('exportMdBtn');
  const responseBody = document.getElementById('responseBody');

  // Onglet 2 : Mode Comparer (HM-13)
  const cmpAgy = /** @type {HTMLInputElement} */ (document.getElementById('cmp-agy'));
  const cmpCodex = /** @type {HTMLInputElement} */ (document.getElementById('cmp-codex'));
  const cmpOpencode = /** @type {HTMLInputElement} */ (document.getElementById('cmp-opencode'));
  const comparePromptInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('comparePromptInput'));
  const runCompareBtn = /** @type {HTMLButtonElement} */ (document.getElementById('runCompareBtn'));

  const metaAgy = document.getElementById('meta-agy');
  const metaCodex = document.getElementById('meta-codex');
  const metaOpencode = document.getElementById('meta-opencode');
  const bodyAgy = document.getElementById('body-agy');
  const bodyCodex = document.getElementById('body-codex');
  const bodyOpencode = document.getElementById('body-opencode');

  // Onglet 3 : Mémoire Centrale (HM-06 & HM-07)
  const saveMemoryBtn = /** @type {HTMLButtonElement} */ (document.getElementById('saveMemoryBtn'));
  const syncMemoryBtn = /** @type {HTMLButtonElement} */ (document.getElementById('syncMemoryBtn'));
  const syncFeedback = document.getElementById('syncFeedback');
  const memoryInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('memoryInput'));
  const memorySyncDir = document.getElementById('memorySyncDir');

  // Onglet 4 : Historique (HM-03 & HM-18)
  const historySearchInput = /** @type {HTMLInputElement} */ (document.getElementById('historySearchInput'));
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const historyList = document.getElementById('historyList');

  // Onglet 5 : Bibliothèque de Prompts (HM-17)
  const addPromptForm = document.getElementById('addPromptForm');
  const newPromptTitle = /** @type {HTMLInputElement} */ (document.getElementById('newPromptTitle'));
  const newPromptText = /** @type {HTMLTextAreaElement} */ (document.getElementById('newPromptText'));
  const libraryList = document.getElementById('libraryList');

  // Modal de synchronisation (HM-07)
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalMsg = document.getElementById('confirmModalMsg');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalForceBtn = document.getElementById('modalForceBtn');

  // ==========================================
  // 2. ÉTAT LOCAL DE L'APPLICATION
  // ==========================================
  let currentRequestId = null;
  let currentAbortController = null;
  let statusTimerInterval = null;

  let lastPrompt = '';
  let lastCli = 'agy';
  let lastRawResponse = '';
  let lastDuration = '';

  let cachedLibrary = [];

  // ==========================================
  // 3. UTILITAIRES DE RENDU MARKDOWN & ÉCHAPPEMENT (HM-11)
  // ==========================================

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderMarkdown(md) {
    if (!md) return '';

    // 1. Extraire les blocs de code multi-lignes ```lang ... ```
    const codeBlocks = [];
    let text = md.replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, (_match, lang, code) => {
      const id = `___CODEBLOCK_${codeBlocks.length}___`;
      codeBlocks.push({ lang: lang.trim(), code });
      return id;
    });

    // 2. Extraire le code inline `code`
    const inlineCodes = [];
    text = text.replace(/`([^`\r\n]+)`/g, (_match, code) => {
      const id = `___INLINECODE_${inlineCodes.length}___`;
      inlineCodes.push(code);
      return id;
    });

    // 3. Échapper le HTML du contenu restant
    text = escapeHtml(text);

    // 4. Titres (# h1 à #### h4)
    text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 5. Blockquotes (> citation)
    text = text.replace(/^>(?:>*) (.*$)/gim, '<blockquote>$1</blockquote>');

    // 6. Gras & Italique
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 7. Listes à puces
    text = text.replace(/^[\*\-] (.+)$/gim, '<li>$1</li>');
    text = text.replace(/(<li>[\s\S]*?<\/li>)/gi, (match) => `<ul>${match}</ul>`);
    text = text.replace(/<\/ul>\s*<ul>/gi, '');

    // 8. Lignes horizontales
    text = text.replace(/^(?:---|\*\*\*|___)\s*$/gim, '<hr />');

    // 9. Liens sécurisés [texte](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 10. Paragraphes et retours à la ligne
    const paragraphs = text.split(/\r?\n\r?\n/);
    text = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (/^<(h[1-6]|ul|ol|hr|blockquote|pre)/i.test(p) || p.startsWith('___CODEBLOCK_')) {
        return p.replace(/\r?\n/g, '<br>');
      }
      return `<p>${p.replace(/\r?\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('\n');

    // 11. Réinsérer le code inline
    inlineCodes.forEach((code, i) => {
      text = text.replace(`___INLINECODE_${i}___`, `<code>${escapeHtml(code)}</code>`);
    });

    // 12. Réinsérer les blocs de code avec bouton de copie
    codeBlocks.forEach(({ lang, code }, i) => {
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
      const blockHtml = `<pre><button type="button" class="code-copy-btn" title="Copier le bloc de code">Copier</button><code${langClass}>${escapeHtml(code)}</code></pre>`;
      text = text.replace(`___CODEBLOCK_${i}___`, blockHtml);
    });

    return `<div class="markdown-body">${text}</div>`;
  }

  // Délégation de clic globale pour tous les boutons "Copier" des blocs de code
  document.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const btn = target.closest('.code-copy-btn');
    if (btn) {
      const pre = btn.closest('pre');
      if (pre) {
        const codeEl = pre.querySelector('code');
        if (codeEl) {
          navigator.clipboard.writeText(codeEl.innerText).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copié !';
            setTimeout(() => { btn.textContent = original; }, 1500);
          }).catch(err => {
            console.error('Erreur lors de la copie du code :', err);
          });
        }
      }
    }
  });

  // ==========================================
  // 4. LECTEUR SSE FETCH + GETREADER() (HM-01, HM-09)
  // ==========================================

  /**
   * Lit un flux SSE HTTP via fetch et getReader()
   * @param {Response} response
   * @param {(event: string, data: any) => void} onEvent
   */
  async function readSseStream(response, onEvent) {
    if (!response.body) {
      throw new Error('Le flux de réponse est indisponible (response.body null).');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            parseSseBlock(buffer, onEvent);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() || '';

        for (const part of parts) {
          if (part.trim()) {
            parseSseBlock(part, onEvent);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Décode un bloc SSE event / data
   * @param {string} block
   * @param {(event: string, data: any) => void} onEvent
   */
  function parseSseBlock(block, onEvent) {
    let eventType = 'message';
    const dataLines = [];
    const lines = block.split(/\r?\n/);

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    const rawData = dataLines.join('\n');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        onEvent(eventType, parsed);
      } catch (_) {
        onEvent(eventType, { text: rawData });
      }
    }
  }

  // ==========================================
  // 5. NAVIGATION PAR ONGLETS & THÈME (HM-20)
  // ==========================================

  function switchTab(targetTabId) {
    navTabs.forEach(tab => {
      const el = /** @type {HTMLElement} */ (tab);
      if (el.dataset.tab === targetTabId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === targetTabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    if (targetTabId === 'tab-history') {
      loadHistory();
    } else if (targetTabId === 'tab-memory') {
      loadMemory();
    } else if (targetTabId === 'tab-library') {
      loadLibrary();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const el = /** @type {HTMLElement} */ (tab);
      if (el.dataset.tab) {
        switchTab(el.dataset.tab);
      }
    });
  });

  function initTheme() {
    const savedTheme = localStorage.getItem('hivemind_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function updateThemeIcon(theme) {
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
      themeToggleBtn.title = theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('hivemind_theme', next);
      updateThemeIcon(next);
    });
  }

  // ==========================================
  // 6. HM-02 & HM-05 : STATUT DES CLI & SÉLECTEUR
  // ==========================================

  async function loadStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const { clis, usage, defaultWorkdir } = data;

      // Initialiser le dossier de travail s'il est vide
      if (workdirInput && !workdirInput.value) {
        const savedWorkdir = localStorage.getItem('hivemind_workdir');
        workdirInput.value = savedWorkdir || defaultWorkdir || '';
      }
      if (memorySyncDir && workdirInput) {
        memorySyncDir.textContent = workdirInput.value || defaultWorkdir || '...';
      }

      // Mise à jour des badges du header
      updateBadge(badgeAgy, 'Antigravity', clis?.agy);
      updateBadge(badgeCodex, 'Codex', clis?.codex);
      updateBadge(badgeOpencode, 'OpenCode', clis?.opencode);

      // Remplir et configurer le sélecteur #cliSelect
      populateCliSelect(clis);

      // Compteurs d'usage du jour
      if (usage && usage.counts) {
        if (cntAgy) cntAgy.textContent = String(usage.counts.agy || 0);
        if (cntCodex) cntCodex.textContent = String(usage.counts.codex || 0);
        if (cntOpencode) cntOpencode.textContent = String(usage.counts.opencode || 0);
      }
    } catch (err) {
      console.error('Erreur chargement /api/status :', err);
    }
  }

  function updateBadge(badgeEl, name, status) {
    if (!badgeEl) return;
    const verEl = badgeEl.querySelector('.badge-ver');

    if (status && status.available) {
      badgeEl.className = 'cli-badge online';
      if (verEl) verEl.textContent = status.version || 'installé';
      badgeEl.title = `${name} : ${status.version || 'Disponible'}`;
    } else {
      badgeEl.className = 'cli-badge offline';
      if (verEl) verEl.textContent = 'absent';
      badgeEl.title = `${name} : indisponible (${status?.error || 'non installé'})`;
    }
  }

  function populateCliSelect(clis) {
    if (!cliSelect) return;

    const currentSelected = cliSelect.value;
    const options = [
      { id: 'agy', label: 'Antigravity CLI (agy)', info: clis?.agy },
      { id: 'codex', label: 'Codex CLI (codex)', info: clis?.codex },
      { id: 'opencode', label: 'OpenCode (opencode)', info: clis?.opencode }
    ];

    cliSelect.innerHTML = '';
    let selectedIsValid = false;

    options.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      const isAvailable = Boolean(item.info && item.info.available);

      if (isAvailable) {
        opt.textContent = `${item.label} — Disponible`;
        opt.disabled = false;
      } else {
        opt.textContent = `${item.label} — Absent`;
        opt.disabled = true;
      }

      if (item.id === currentSelected && isAvailable) {
        opt.selected = true;
        selectedIsValid = true;
      }

      cliSelect.appendChild(opt);
    });

    // Si la sélection actuelle est invalide/absente, basculer sur la 1ère CLI disponible
    if (!selectedIsValid) {
      const firstAvailable = options.find(o => o.info && o.info.available);
      if (firstAvailable) {
        cliSelect.value = firstAvailable.id;
      }
    }
  }

  if (workdirInput) {
    workdirInput.addEventListener('input', () => {
      localStorage.setItem('hivemind_workdir', workdirInput.value.trim());
      if (memorySyncDir) {
        memorySyncDir.textContent = workdirInput.value.trim() || '...';
      }
    });
  }

  // ==========================================
  // 7. HM-01, HM-09, HM-10, HM-12 : PROMPT & SSE
  // ==========================================

  function setPromptUiState(loading, message = 'Prêt') {
    if (loading) {
      if (requestStatus) requestStatus.className = 'status-indicator loading';
      if (statusText) statusText.textContent = message;
      if (cancelBtn) cancelBtn.style.display = 'inline-flex';
      if (sendBtn) sendBtn.disabled = true;
    } else {
      if (requestStatus) requestStatus.className = 'status-indicator idle';
      if (statusText) statusText.textContent = message;
      if (cancelBtn) cancelBtn.style.display = 'none';
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function startExecutionTimer() {
    stopExecutionTimer();
    const startTime = Date.now();
    if (statusTimer) statusTimer.textContent = '0.0s';
    if (responseTime) responseTime.textContent = '0.0s';

    statusTimerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      if (statusTimer) statusTimer.textContent = `${elapsed}s`;
      if (responseTime) responseTime.textContent = `${elapsed}s`;
    }, 100);
  }

  function stopExecutionTimer(finalDuration) {
    if (statusTimerInterval) {
      clearInterval(statusTimerInterval);
      statusTimerInterval = null;
    }
    if (finalDuration !== undefined) {
      const formatted = String(finalDuration).endsWith('s') ? finalDuration : `${finalDuration}s`;
      if (statusTimer) statusTimer.textContent = formatted;
      if (responseTime) responseTime.textContent = formatted;
    }
  }

  async function sendPrompt() {
    const prompt = (promptInput?.value || '').trim();
    if (!prompt) {
      if (promptInput) promptInput.focus();
      return;
    }

    const cli = cliSelect?.value || 'agy';
    const workdir = (workdirInput?.value || '').trim();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    currentRequestId = requestId;
    currentAbortController = new AbortController();

    lastPrompt = prompt;
    lastCli = cli;
    lastRawResponse = '';
    lastDuration = '';

    if (responseCliTag) responseCliTag.textContent = cli.toUpperCase();
    if (responseBody) {
      responseBody.innerHTML = `
        <div class="response-placeholder">
          <span class="spinner" style="display:inline-block; margin-right:8px;"></span>
          <span>Connexion à <strong>${escapeHtml(cli)}</strong>…</span>
        </div>`;
    }

    setPromptUiState(true, 'Exécution en cours…');
    startExecutionTimer();

    let streamStarted = false;
    let accumulatedStderr = '';

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cli, prompt, workdir, requestId }),
        signal: currentAbortController.signal
      });

      if (!res.ok) {
        let errMessage = `Erreur HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.error) errMessage = errJson.error;
        } catch (_) {}
        throw new Error(errMessage);
      }

      await readSseStream(res, (event, data) => {
        if (event === 'start') {
          streamStarted = true;
          setPromptUiState(true, `${cli.toUpperCase()} génère la réponse…`);
        } else if (event === 'chunk') {
          if (!streamStarted && responseBody) {
            responseBody.innerHTML = '';
            streamStarted = true;
          }
          lastRawResponse += data.text || '';
          if (responseBody) {
            responseBody.innerHTML = renderMarkdown(lastRawResponse);
            responseBody.scrollTop = responseBody.scrollHeight;
          }
        } else if (event === 'stderr') {
          accumulatedStderr += data.text || '';
          // Si aucun texte généré pour l'instant, afficher le flux stderr afin que l'écran ne soit jamais muet
          if (!lastRawResponse && responseBody) {
            responseBody.innerHTML = `
              <div class="alert-box warning">
                <small><strong>[Flux stderr en direct]</strong><br>${escapeHtml(accumulatedStderr)}</small>
              </div>`;
          }
        } else if (event === 'done') {
          stopExecutionTimer(data.duration);
          lastDuration = data.duration ? `${data.duration}s` : '';
          if (data.response) {
            lastRawResponse = data.response;
          }
          if (responseBody) {
            if (lastRawResponse) {
              responseBody.innerHTML = renderMarkdown(lastRawResponse);
            } else {
              // Fin de processus sans sortie stdout directe
              responseBody.innerHTML = `
                <div class="alert-box warning">
                  <p>La commande s'est achevée sans émettre de texte stdout (durée : ${escapeHtml(data.duration || '0')}s).</p>
                  ${accumulatedStderr ? `<hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color);"><small><strong>Diagnostic stderr :</strong><br>${escapeHtml(accumulatedStderr)}</small>` : ''}
                </div>`;
            }
          }
          setPromptUiState(false, 'Terminé');
          loadStatus();
        } else if (event === 'error') {
          stopExecutionTimer(data.duration);
          lastDuration = data.duration ? `${data.duration}s` : '';
          setPromptUiState(false, 'Erreur');

          let errorHtml = `
            <div class="alert-box error">
              <strong>Échec d'exécution :</strong> ${escapeHtml(data.message || 'Erreur inconnue')}
            </div>`;
          if (accumulatedStderr && !String(data.message).includes(accumulatedStderr.trim())) {
            errorHtml += `
              <div class="alert-box warning" style="margin-top:8px;">
                <small><strong>Détails du flux stderr :</strong><br>${escapeHtml(accumulatedStderr)}</small>
              </div>`;
          }
          if (responseBody) {
            responseBody.innerHTML = errorHtml;
          }
        }
      });
    } catch (err) {
      stopExecutionTimer();
      if (err.name === 'AbortError') {
        setPromptUiState(false, 'Annulé');
        if (responseBody) {
          responseBody.innerHTML = `
            <div class="alert-box warning">
              ⛔ Requête annulée par l'utilisateur.
            </div>`;
        }
      } else {
        setPromptUiState(false, 'Erreur');
        if (responseBody) {
          responseBody.innerHTML = `
            <div class="alert-box error">
              <strong>Erreur réseau ou client :</strong> ${escapeHtml(err.message)}
            </div>`;
        }
      }
    } finally {
      currentRequestId = null;
      currentAbortController = null;
      if (sendBtn) sendBtn.disabled = false;
      if (cancelBtn) cancelBtn.style.display = 'none';
    }
  }

  // Clic sur Envoyer
  if (sendBtn) {
    sendBtn.addEventListener('click', sendPrompt);
  }

  // Raccourci Ctrl+Entrée ou Cmd+Entrée
  if (promptInput) {
    promptInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendPrompt();
      }
    });
  }

  // Vider le champ de saisie
  if (clearPromptBtn) {
    clearPromptBtn.addEventListener('click', () => {
      if (promptInput) {
        promptInput.value = '';
        promptInput.focus();
      }
    });
  }

  // Annuler via /api/cancel
  if (cancelBtn) {
    cancelBtn.addEventListener('click', async () => {
      const idToCancel = currentRequestId;
      if (idToCancel) {
        try {
          await fetch('/api/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: idToCancel })
          });
        } catch (e) {
          console.error('Erreur appel /api/cancel :', e);
        }
      }
      if (currentAbortController) {
        currentAbortController.abort();
      }
    });
  }

  // Copier toute la réponse
  if (copyResponseBtn) {
    copyResponseBtn.addEventListener('click', () => {
      if (!lastRawResponse) return;
      navigator.clipboard.writeText(lastRawResponse).then(() => {
        const orig = copyResponseBtn.textContent;
        copyResponseBtn.textContent = '✅ Copié !';
        setTimeout(() => { copyResponseBtn.textContent = orig; }, 1500);
      }).catch(err => {
        console.error('Erreur copie presse-papier :', err);
      });
    });
  }

  // Relayer la réponse vers une autre IA (HM-15)
  if (relayBtn) {
    relayBtn.addEventListener('click', () => {
      if (!lastRawResponse) {
        alert('Aucune réponse à relayer pour le moment.');
        return;
      }
      if (promptInput) {
        promptInput.value = lastRawResponse;
      }
      if (cliSelect) {
        const currentVal = cliSelect.value;
        const alternate = Array.from(cliSelect.options).find(o => !o.disabled && o.value !== currentVal);
        if (alternate) {
          cliSelect.value = alternate.value;
        }
      }
      switchTab('tab-chat');
      if (promptInput) promptInput.focus();
    });
  }

  // Exporter la conversation en fichier .md (HM-19)
  if (exportMdBtn) {
    exportMdBtn.addEventListener('click', () => {
      if (!lastRawResponse && !lastPrompt) {
        alert('Aucun échange à exporter.');
        return;
      }
      const exportContent = `# Échange Hivemind
- Date : ${new Date().toLocaleString('fr-FR')}
- CLI : ${lastCli ? lastCli.toUpperCase() : 'INCONNUE'}
- Durée : ${lastDuration || '-'}
- Dossier : ${workdirInput ? workdirInput.value : '-'}

## Prompt
${lastPrompt || ''}

## Réponse
${lastRawResponse || ''}
`;
      const blob = new Blob([exportContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hivemind_${lastCli || 'ia'}_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================
  // 8. HM-03 & HM-18 : HISTORIQUE DES ÉCHANGES
  // ==========================================

  async function loadHistory(query = '') {
    if (!historyList) return;

    try {
      const url = query ? `/api/history?q=${encodeURIComponent(query)}` : '/api/history';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const history = await res.json();
      renderHistoryList(Array.isArray(history) ? history : []);
    } catch (err) {
      console.error('Erreur chargement /api/history :', err);
      historyList.innerHTML = `<p class="empty-state">Erreur lors du chargement de l'historique : ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderHistoryList(items) {
    if (!historyList) return;

    if (!items || items.length === 0) {
      historyList.innerHTML = '<p class="empty-state">Aucun échange dans l\'historique.</p>';
      return;
    }

    historyList.innerHTML = '';
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'history-item';
      itemEl.dataset.id = item.id;

      const dateStr = item.timestamp ? new Date(item.timestamp).toLocaleString('fr-FR') : '';
      const previewText = item.response ? item.response.slice(0, 160) : '(Aucune réponse)';

      itemEl.innerHTML = `
        <div class="history-meta">
          <span><strong class="response-cli-tag">${escapeHtml((item.cli || '').toUpperCase())}</strong> • ${escapeHtml(dateStr)}</span>
          <span>${escapeHtml(item.duration || '')} ${item.success ? '✅' : '❌'}</span>
        </div>
        <div class="history-prompt">${escapeHtml(item.prompt || '')}</div>
        <div class="history-preview">${escapeHtml(previewText)}</div>
      `;

      itemEl.addEventListener('click', () => {
        lastPrompt = item.prompt || '';
        lastCli = item.cli || 'agy';
        lastRawResponse = item.response || '';
        lastDuration = item.duration || '';

        if (promptInput) promptInput.value = lastPrompt;
        if (cliSelect && Array.from(cliSelect.options).some(o => o.value === lastCli)) {
          cliSelect.value = lastCli;
        }
        if (responseCliTag) responseCliTag.textContent = lastCli.toUpperCase();
        if (responseTime) responseTime.textContent = lastDuration;
        if (responseBody) {
          responseBody.innerHTML = renderMarkdown(lastRawResponse || '*(Aucune réponse enregistrée)*');
        }

        switchTab('tab-chat');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      historyList.appendChild(itemEl);
    });
  }

  let historySearchTimeout = null;
  if (historySearchInput) {
    historySearchInput.addEventListener('input', () => {
      clearTimeout(historySearchTimeout);
      historySearchTimeout = setTimeout(() => {
        loadHistory(historySearchInput.value.trim());
      }, 200);
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', async () => {
      if (!confirm("Voulez-vous vraiment effacer tout l'historique des échanges ?")) {
        return;
      }
      try {
        const res = await fetch('/api/history', { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        loadHistory();
      } catch (err) {
        alert(`Échec de la suppression de l'historique : ${err.message}`);
      }
    });
  }

  // ==========================================
  // 9. HM-06 & HM-07 : MÉMOIRE CENTRALE
  // ==========================================

  async function loadMemory() {
    try {
      const res = await fetch('/api/memory');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (memoryInput) {
        memoryInput.value = data.content || '';
      }
      if (memorySyncDir && workdirInput) {
        memorySyncDir.textContent = workdirInput.value.trim() || '...';
      }
    } catch (err) {
      console.error('Erreur chargement /api/memory :', err);
    }
  }

  function showSyncFeedback(type, message) {
    if (!syncFeedback) return;
    syncFeedback.className = `alert-box ${type}`;
    syncFeedback.textContent = message;
    syncFeedback.style.display = 'block';
  }

  if (saveMemoryBtn) {
    saveMemoryBtn.addEventListener('click', async () => {
      const content = memoryInput ? memoryInput.value : '';
      try {
        saveMemoryBtn.disabled = true;
        const res = await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showSyncFeedback('success', 'Mémoire centrale enregistrée localement.');
          setTimeout(() => { if (syncFeedback) syncFeedback.style.display = 'none'; }, 4000);
        } else {
          showSyncFeedback('error', data.error || 'Erreur lors de l\'enregistrement.');
        }
      } catch (err) {
        showSyncFeedback('error', `Erreur réseau : ${err.message}`);
      } finally {
        saveMemoryBtn.disabled = false;
      }
    });
  }

  async function triggerMemorySync(force = false) {
    const targetDir = (workdirInput?.value || '').trim();
    try {
      if (syncMemoryBtn) syncMemoryBtn.disabled = true;
      const res = await fetch('/api/memory/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDir, force })
      });
      const data = await res.json();

      if (data.warning && !force) {
        if (confirmModalMsg) confirmModalMsg.textContent = data.message;
        if (confirmModal) confirmModal.style.display = 'flex';
        return;
      }

      if (data.success) {
        showSyncFeedback('success', data.message || 'Synchronisation réussie.');
      } else {
        showSyncFeedback('error', data.error || 'Erreur lors de la synchronisation.');
      }
    } catch (err) {
      showSyncFeedback('error', `Erreur : ${err.message}`);
    } finally {
      if (syncMemoryBtn) syncMemoryBtn.disabled = false;
    }
  }

  if (syncMemoryBtn) {
    syncMemoryBtn.addEventListener('click', () => triggerMemorySync(false));
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      if (confirmModal) confirmModal.style.display = 'none';
    });
  }

  if (modalForceBtn) {
    modalForceBtn.addEventListener('click', () => {
      if (confirmModal) confirmModal.style.display = 'none';
      triggerMemorySync(true);
    });
  }

  // ==========================================
  // 10. HM-17 : BIBLIOTHÈQUE DE PROMPTS
  // ==========================================

  async function loadLibrary() {
    try {
      const res = await fetch('/api/library');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const library = await res.json();
      cachedLibrary = Array.isArray(library) ? library : [];
      renderLibrary(cachedLibrary);
      populateQuickLibrary(cachedLibrary);
    } catch (err) {
      console.error('Erreur chargement /api/library :', err);
    }
  }

  function renderLibrary(prompts) {
    if (!libraryList) return;

    if (!prompts || prompts.length === 0) {
      libraryList.innerHTML = '<p class="empty-state">Aucun prompt enregistré dans la bibliothèque.</p>';
      return;
    }

    libraryList.innerHTML = '';
    prompts.forEach(item => {
      const card = document.createElement('div');
      card.className = 'library-card';
      card.innerHTML = `
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.prompt)}</p>
        </div>
        <div class="library-actions">
          <button type="button" class="btn btn-sm btn-primary use-prompt-btn" data-id="${item.id}">Utiliser</button>
          <button type="button" class="btn btn-sm btn-danger del-prompt-btn" data-id="${item.id}">Supprimer</button>
        </div>
      `;

      const useBtn = card.querySelector('.use-prompt-btn');
      if (useBtn) {
        useBtn.addEventListener('click', () => {
          if (promptInput) {
            promptInput.value = item.prompt;
          }
          switchTab('tab-chat');
          if (promptInput) promptInput.focus();
        });
      }

      const delBtn = card.querySelector('.del-prompt-btn');
      if (delBtn) {
        delBtn.addEventListener('click', async () => {
          if (!confirm(`Supprimer le prompt "${item.title}" ?`)) return;
          try {
            const delRes = await fetch(`/api/library/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
            if (delRes.ok) loadLibrary();
          } catch (e) {
            alert(`Erreur de suppression : ${e.message}`);
          }
        });
      }

      libraryList.appendChild(card);
    });
  }

  function populateQuickLibrary(prompts) {
    if (!quickLibrarySelect) return;
    quickLibrarySelect.innerHTML = '<option value="">⚡ Insérer un prompt favori…</option>';
    prompts.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.title;
      quickLibrarySelect.appendChild(opt);
    });
  }

  if (quickLibrarySelect) {
    quickLibrarySelect.addEventListener('change', () => {
      const selectedId = quickLibrarySelect.value;
      if (!selectedId) return;
      const found = cachedLibrary.find(p => String(p.id) === String(selectedId));
      if (found && promptInput) {
        promptInput.value = found.prompt;
        promptInput.focus();
      }
      quickLibrarySelect.value = '';
    });
  }

  if (addPromptForm) {
    addPromptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = (newPromptTitle?.value || '').trim();
      const prompt = (newPromptText?.value || '').trim();

      if (!title || !prompt) return;

      try {
        const res = await fetch('/api/library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, prompt })
        });
        if (res.ok) {
          if (newPromptTitle) newPromptTitle.value = '';
          if (newPromptText) newPromptText.value = '';
          loadLibrary();
        } else {
          const err = await res.json();
          alert(`Erreur : ${err.error || 'Échec de l\'ajout'}`);
        }
      } catch (err) {
        alert(`Erreur réseau : ${err.message}`);
      }
    });
  }

  // ==========================================
  // 11. HM-13 : MODE COMPARER EN PARALLÈLE
  // ==========================================

  async function runCompareForCli(cli, prompt, workdir, metaEl, bodyEl) {
    if (!metaEl || !bodyEl) return;

    const reqId = `cmp_${cli}_${Date.now()}`;
    let fullText = '';
    let accumulatedStderr = '';
    const startTime = Date.now();

    metaEl.textContent = 'En cours…';
    bodyEl.innerHTML = `
      <div class="status-indicator loading">
        <span class="spinner"></span> <span>Génération ${cli.toUpperCase()}…</span>
      </div>`;

    const timer = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      metaEl.textContent = `${elapsed}s…`;
    }, 100);

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cli, prompt, workdir, requestId: reqId })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await readSseStream(res, (event, data) => {
        if (event === 'chunk') {
          fullText += data.text || '';
          bodyEl.innerHTML = renderMarkdown(fullText);
          bodyEl.scrollTop = bodyEl.scrollHeight;
        } else if (event === 'stderr') {
          accumulatedStderr += data.text || '';
          if (!fullText) {
            bodyEl.innerHTML = `
              <div class="alert-box warning">
                <small><strong>[Flux stderr]</strong><br>${escapeHtml(accumulatedStderr)}</small>
              </div>`;
          }
        } else if (event === 'done') {
          clearInterval(timer);
          const dur = data.duration ? `${data.duration}s` : `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
          metaEl.textContent = `${dur} ✅`;
          if (data.response) fullText = data.response;
          if (fullText) {
            bodyEl.innerHTML = renderMarkdown(fullText);
          } else {
            bodyEl.innerHTML = `
              <div class="alert-box warning">
                <p>Terminé sans sortie stdout (durée : ${dur}).</p>
                ${accumulatedStderr ? `<hr style="margin:6px 0; border:none; border-top:1px solid var(--border-color);"><small>${escapeHtml(accumulatedStderr)}</small>` : ''}
              </div>`;
          }
        } else if (event === 'error') {
          clearInterval(timer);
          const dur = data.duration ? `${data.duration}s` : `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
          metaEl.textContent = `${dur} ❌`;
          bodyEl.innerHTML = `
            <div class="alert-box error">
              <strong>Erreur :</strong> ${escapeHtml(data.message || 'Échec')}
            </div>`;
        }
      });
    } catch (err) {
      clearInterval(timer);
      metaEl.textContent = '❌ Erreur';
      bodyEl.innerHTML = `
        <div class="alert-box error">
          <strong>Erreur :</strong> ${escapeHtml(err.message)}
        </div>`;
    } finally {
      clearInterval(timer);
    }
  }

  if (runCompareBtn) {
    runCompareBtn.addEventListener('click', async () => {
      const prompt = (comparePromptInput?.value || '').trim();
      if (!prompt) {
        alert('Veuillez saisir un prompt à envoyer en comparaison.');
        if (comparePromptInput) comparePromptInput.focus();
        return;
      }

      const workdir = (workdirInput?.value || '').trim();
      const selected = [];

      if (cmpAgy?.checked) selected.push({ cli: 'agy', meta: metaAgy, body: bodyAgy });
      else {
        if (metaAgy) metaAgy.textContent = '-';
        if (bodyAgy) bodyAgy.textContent = 'Non sélectionné';
      }

      if (cmpCodex?.checked) selected.push({ cli: 'codex', meta: metaCodex, body: bodyCodex });
      else {
        if (metaCodex) metaCodex.textContent = '-';
        if (bodyCodex) bodyCodex.textContent = 'Non sélectionné';
      }

      if (cmpOpencode?.checked) selected.push({ cli: 'opencode', meta: metaOpencode, body: bodyOpencode });
      else {
        if (metaOpencode) metaOpencode.textContent = '-';
        if (bodyOpencode) bodyOpencode.textContent = 'Non sélectionné';
      }

      if (selected.length === 0) {
        alert('Veuillez cocher au moins une CLI à comparer.');
        return;
      }

      runCompareBtn.disabled = true;

      try {
        await Promise.allSettled(
          selected.map(item => runCompareForCli(item.cli, prompt, workdir, item.meta, item.body))
        );
      } finally {
        runCompareBtn.disabled = false;
        loadStatus();
      }
    });
  }

  // ==========================================
  // 12. INITIALISATION GLOBALE DE L'APPLICATION
  // ==========================================
  initTheme();
  loadStatus();
  loadLibrary();
});
