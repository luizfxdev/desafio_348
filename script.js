// Elementos do DOM
const messageInput = document.getElementById('message-input');
const decipherBtn = document.getElementById('decipher-btn');
const returnBtn = document.getElementById('return-btn');
const resultSection = document.getElementById('result-section');
const resultContent = document.getElementById('result-content');
const bgAudio = document.getElementById('bg-audio');
const playAudioBtn = document.getElementById('play-audio');
const pauseAudioBtn = document.getElementById('pause-audio');

// Tabela de valores dos versos
const versesTable = {
  'brisa suave': 1,
  'doce luar': 5,
  'cores dançam': 10,
  'valsa eterna': 50,
  'alvorada branca': 100
};

// Controles de áudio
playAudioBtn.addEventListener('click', () => {
  bgAudio.play();
  playAudioBtn.style.opacity = '0.5';
  pauseAudioBtn.style.opacity = '1';
});

pauseAudioBtn.addEventListener('click', () => {
  bgAudio.pause();
  pauseAudioBtn.style.opacity = '0.5';
  playAudioBtn.style.opacity = '1';
});

// Função para normalizar texto (remover acentos, converter para minúsculas)
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Função para verificar se é anagrama
function isAnagram(str1, str2) {
  const clean1 = str1.replace(/\s/g, '').split('').sort().join('');
  const clean2 = str2.replace(/\s/g, '').split('').sort().join('');
  return clean1 === clean2;
}

// Função para encontrar versos exatos
function findExactVerses(message) {
  const found = [];
  const normalized = normalizeText(message);

  for (const [verse, value] of Object.entries(versesTable)) {
    const normalizedVerse = normalizeText(verse);

    // Busca por ocorrências exatas (com delimitadores)
    const regex = new RegExp(`(^|[^a-z])${normalizedVerse}([^a-z]|$)`, 'g');
    const matches = [...normalized.matchAll(regex)];

    if (matches.length > 0) {
      found.push({
        verse,
        value,
        count: matches.length,
        type: 'exato'
      });
    }
  }

  return found;
}

// Função para encontrar anagramas
function findAnagrams(message) {
  const found = [];
  const segments = message.split(/[\/;,]/);

  for (const segment of segments) {
    const normalized = normalizeText(segment);

    for (const [verse, value] of Object.entries(versesTable)) {
      const normalizedVerse = normalizeText(verse);

      // Verifica se é anagrama e se já não foi encontrado como verso exato
      if (isAnagram(normalized, normalizedVerse) && !normalized.includes(normalizedVerse)) {
        found.push({
          verse,
          value,
          original: segment.trim(),
          type: 'anagrama'
        });
      }
    }
  }

  return found;
}

// Função principal de decifração
function decipherMessage() {
  const message = messageInput.value.trim();

  if (!message) {
    showError('Por favor, insira uma mensagem poética.');
    return;
  }

  // Encontra versos exatos
  const exactVerses = findExactVerses(message);

  // Encontra anagramas
  const anagrams = findAnagrams(message);

  // Calcula totais
  const exactTotal = exactVerses.reduce((sum, item) => sum + item.value * item.count, 0);
  const anagramTotal = anagrams.reduce((sum, item) => sum + item.value, 0);
  const finalTotal = exactTotal + anagramTotal;

  // Exibe resultado
  displayResult(exactVerses, anagrams, exactTotal, anagramTotal, finalTotal);
}

// Função para exibir erro
function showError(message) {
  resultContent.innerHTML = `
        <div class="calc-step" style="border-left-color: rgba(255, 150, 150, 0.6);">
            <div class="calc-title">⚠️ Atenção</div>
            <div class="calc-detail">${message}</div>
        </div>
    `;
  resultSection.classList.add('show');
}

// Função para exibir resultado
function displayResult(exactVerses, anagrams, exactTotal, anagramTotal, finalTotal) {
  let html = '';

  // Versos exatos encontrados
  if (exactVerses.length > 0) {
    html += '<div class="calc-step">';
    html += '<div class="calc-title">🎵 Versos Explícitos Encontrados:</div>';
    exactVerses.forEach(item => {
      const total = item.value * item.count;
      html += `<div class="calc-detail">• "${item.verse}" (${item.value} pontos) × ${item.count} = ${total} pontos</div>`;
    });
    html += `<div class="calc-detail" style="margin-top: 10px; font-weight: 600; color: #633ed5;">Subtotal de versos exatos: ${exactTotal} pontos</div>`;
    html += '</div>';
  } else {
    html += '<div class="calc-step">';
    html += '<div class="calc-title">🎵 Versos Explícitos:</div>';
    html += '<div class="calc-detail">Nenhum verso explícito encontrado na mensagem.</div>';
    html += '</div>';
  }

  // Anagramas encontrados
  if (anagrams.length > 0) {
    html += '<div class="calc-step">';
    html += '<div class="calc-title">🎭 Anagramas Descobertos (Eco dos Versos Escondidos):</div>';
    anagrams.forEach(item => {
      html += `<div class="calc-detail">• "${item.original}" é anagrama de "${item.verse}" = ${item.value} pontos</div>`;
    });
    html += `<div class="calc-detail" style="margin-top: 10px; font-weight: 600; color: #633ed5;">Subtotal de anagramas: ${anagramTotal} pontos</div>`;
    html += '</div>';
  } else {
    html += '<div class="calc-step">';
    html += '<div class="calc-title">🎭 Anagramas:</div>';
    html += '<div class="calc-detail">Nenhum anagrama escondido foi encontrado.</div>';
    html += '</div>';
  }

  // Cálculo final
  html += '<div class="calc-step">';
  html += '<div class="calc-title">📊 Cálculo Final:</div>';
  html += `<div class="calc-detail">Versos explícitos: ${exactTotal} pontos</div>`;
  html += `<div class="calc-detail">Anagramas escondidos: ${anagramTotal} pontos</div>`;
  html += `<div class="calc-detail" style="font-weight: 700; color: #633ed5; margin-top: 8px;">Total: ${exactTotal} + ${anagramTotal} = ${finalTotal} pontos</div>`;
  html += '</div>';

  // Resultado final destacado
  html += '<div class="final-result">';
  html += '<div class="final-result-label">✨ Sinfonia Completa ✨</div>';
  html += `<div class="final-result-value">${finalTotal}</div>`;
  html += '<div class="calc-detail" style="margin-top: 10px;">pontos mágicos</div>';
  html += '</div>';

  resultContent.innerHTML = html;
  resultSection.classList.add('show');

  // Scroll suave para o resultado
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// Função para retornar ao estado inicial
function returnToInitial() {
  messageInput.value = '';
  resultSection.classList.remove('show');
  resultContent.innerHTML = '';
  messageInput.focus();
}

// Event Listeners
decipherBtn.addEventListener('click', decipherMessage);
returnBtn.addEventListener('click', returnToInitial);

// Permitir ENTER para decifrar (Ctrl+Enter no textarea)
messageInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    decipherMessage();
  }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  messageInput.focus();
  pauseAudioBtn.style.opacity = '0.5';
});
