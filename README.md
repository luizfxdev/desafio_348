# 🎻 Sinfonia Celestial dos Versos

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Uma aplicação web interativa que desvenda o valor mágico de versos poéticos, incluindo detecção de anagramas escondidos. Desenvolvida com HTML, CSS e JavaScript puro.

## 📋 Descrição do Desafio

**Título:** Sinfonia Celestial dos Versos

**Desafio Inicial:**
Você é o(a) guardião(ã) de uma orquestra cósmica, onde cada verso poético carrega o poder de notas encantadas. Receberá uma mensagem, que é uma string composta por frases poéticas curtas — cada uma delas possui um valor mágico.

**Tabela de valores dos versos:**
- "Brisa suave" - 1
- "Doce luar" - 5
- "Cores dançam" - 10
- "Valsa eterna" - 50
- "Alvorada branca" - 100

**Regras:**
- Cada mensagem pode conter múltiplas frases (separadas, por exemplo, por ponto e vírgula ou barra).
- Some o valor atribuído a cada frase poética presente.
- Frases não reconhecidas são ignoradas.

**Exemplo de entrada:** `"Brisa suave / Doce luar / Valsa eterna"`  
**Saída esperada:** `56` (1 + 5 + 50)

**Desafio Extra: "O Eco dos Versos Escondidos"**

Após desvendar a soma dos valores dos versos explícitos, descubra todos os anagramas possíveis dos versos-poema conhecidos ocultos na mensagem (sem acentos, considerando apenas letras). Para cada anagrama encontrado, atribua novamente o valor da frase original à soma — até mesmo versos rearranjados podem ecoar sua magia!

**Exemplo:**  
Mensagem: `"Brisa eu a v esuave / Alvorada branca / Luar Doc e"`
- "Alvorada branca" é reconhecida claramente (100)
- "Brisa eu a v esuave" contém um anagrama de "Brisa suave" (1)
- "Luar Doc e" contém "Doce luar" embaralhado (5)

**Saída esperada:** `106` (100 + 1 + 5)

## 🎯 Aplicações em Projetos Reais

Este projeto demonstra conceitos fundamentais que podem ser aplicados em:

- **Sistemas de Análise de Texto:** Processamento e validação de strings complexas
- **Gamificação:** Sistemas de pontuação baseados em padrões textuais
- **Validadores de Formulários:** Detecção de padrões e normalização de dados
- **Processamento de Linguagem Natural (NLP):** Técnicas básicas de análise textual
- **Sistemas de Busca:** Algoritmos de correspondência fuzzy e detecção de anagramas
- **Ferramentas Educacionais:** Jogos de palavras e puzzles linguísticos

## 🔧 Função Principal do Script

A função central que resolve o desafio é a **`decipherMessage()`**, que orquestra todo o processo:

```javascript
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
    const exactTotal = exactVerses.reduce((sum, item) => sum + (item.value * item.count), 0);
    const anagramTotal = anagrams.reduce((sum, item) => sum + item.value, 0);
    const finalTotal = exactTotal + anagramTotal;
    
    // Exibe resultado
    displayResult(exactVerses, anagrams, exactTotal, anagramTotal, finalTotal);
}
```

## 🧠 Lógica Técnica de Solução

### 1. Normalização de Texto

```javascript
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}
```

**Técnica:** Utiliza o método `normalize('NFD')` para decompor caracteres acentuados em seus componentes base + diacrítico, seguido de remoção via regex. Isso garante que "Doce Luar", "doce luar" e "doce lúar" sejam tratados igualmente.

### 2. Detecção de Versos Explícitos

```javascript
function findExactVerses(message) {
    const found = [];
    const normalized = normalizeText(message);
    
    for (const [verse, value] of Object.entries(versesTable)) {
        const normalizedVerse = normalizeText(verse);
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
```

**Técnica:** 
- Usa **RegEx com word boundaries** customizados `(^|[^a-z])` e `([^a-z]|$)` para garantir correspondências exatas
- Permite múltiplas ocorrências do mesmo verso através de `matchAll()`
- Retorna objetos estruturados com metadata completa

### 3. Detecção de Anagramas

```javascript
function isAnagram(str1, str2) {
    const clean1 = str1.replace(/\s/g, '').split('').sort().join('');
    const clean2 = str2.replace(/\s/g, '').split('').sort().join('');
    return clean1 === clean2;
}

function findAnagrams(message) {
    const found = [];
    const segments = message.split(/[\/;,]/);
    
    for (const segment of segments) {
        const normalized = normalizeText(segment);
        
        for (const [verse, value] of Object.entries(versesTable)) {
            const normalizedVerse = normalizeText(verse);
            
            if (isAnagram(normalized, normalizedVerse) && 
                !normalized.includes(normalizedVerse)) {
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
```

**Técnica:**
- **Algoritmo de detecção de anagrama:** Remove espaços, converte para array, ordena alfabeticamente e reconstrói
- **Segmentação inteligente:** Divide a mensagem por delimitadores comuns (`/`, `;`, `,`)
- **Validação dupla:** Garante que não sejam detectados como anagramas os versos já encontrados explicitamente

### 4. Agregação e Cálculo

```javascript
const exactTotal = exactVerses.reduce((sum, item) => sum + (item.value * item.count), 0);
const anagramTotal = anagrams.reduce((sum, item) => sum + item.value, 0);
const finalTotal = exactTotal + anagramTotal;
```

**Técnica:** Usa o método funcional `reduce()` para agregação eficiente, considerando contagem de repetições apenas para versos explícitos.

## 📊 Complexidade Algorítmica

- **Normalização:** O(n) onde n é o tamanho da string
- **Detecção de versos exatos:** O(m × n) onde m é o número de versos e n é o tamanho da mensagem
- **Detecção de anagramas:** O(s × m × k log k) onde s é o número de segmentos, m é o número de versos, e k é o tamanho médio dos versos
- **Complexidade espacial:** O(m) para armazenar resultados

## 🚀 Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/luizfxdev/desafio_348
```

2. Adicione os arquivos de mídia na pasta `assets/`:
   - `background.mp4` (vídeo de fundo)
   - `theme.mp3` (música tema)

3. Abra `index.html` em um navegador moderno

## 💡 Exemplos de Uso

### Exemplo 1: Versos Simples
**Input:** `Brisa suave / Doce luar / Valsa eterna`  
**Output:** `56` (1 + 5 + 50)

### Exemplo 2: Versos com Repetição
**Input:** `Alvorada branca / Alvorada branca / Cores dançam`  
**Output:** `210` (100 + 100 + 10)

### Exemplo 3: Apenas Anagramas
**Input:** `asuev asirB / raul ecoD`  
**Output:** `6` (1 do anagrama de "Brisa suave" + 5 do anagrama de "Doce luar")

### Exemplo 4: Mix de Versos e Anagramas
**Input:** `Valsa eterna / cnabra adavorlA / texto irrelevante / Doce luar`  
**Output:** `155` (50 + 100 + 5)

### Exemplo 5: Com Texto Irrelevante
**Input:** `Hoje o dia está lindo / Brisa suave / que maravilha / Cores dançam`  
**Output:** `11` (1 + 10)

### Exemplo 6: Versos com Capitalização Variada
**Input:** `BRISA SUAVE / Doce LuAr / VaLsA eTeRnA`  
**Output:** `56` (1 + 5 + 50)

### Exemplo 7: Complexo com Tudo
**Input:** `Alvorada branca / avet aslav / Brisa suave / Cores dançam / m acnadseroC`  
**Output:** `172` (100 + 50 anagrama + 1 + 10 + 10 anagrama)

## 🎨 Características

- ✨ Design celestial com transparências e blur effects
- 🎵 Controles de áudio integrados
- 📱 Totalmente responsivo
- 🎭 Animações suaves e elegantes
- 🔍 Detecção inteligente de anagramas
- 📊 Exibição detalhada do cálculo passo a passo
- ♿ Acessibilidade com navegação por teclado (Ctrl+Enter para decifrar)

## 🛠️ Tecnologias Utilizadas

- HTML5 (Estrutura semântica)
- CSS3 (Flexbox, Grid, Animations, Backdrop Filter)
- JavaScript ES6+ (Arrow Functions, Template Literals, Destructuring, Spread Operator)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

**Luiz Felipe de Oliveira**

- GitHub: [@luizfxdev](https://github.com/luizfxdev)
- Linkedin: [in/luizfxdev](https://www.linkedin.com/in/luizfxdev)
- Portfólio: [luizfxdev.com.br](https://luizfxdev.com.br)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

***A valsa é a primeira dança do mundo; pelo menos é a única dança em que há poesia.*** (Machado de Assis)
