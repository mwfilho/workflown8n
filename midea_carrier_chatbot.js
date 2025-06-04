const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

// Browserless endpoint with token
const BROWSERLESS_FUNCTION_URL = 'https://chrome.browserless.io/function?token=2SPBwNmoXs9lAWleb18afef9c8ea33a8d4534967cd2bc1888';

// OpenAI API key should be provided via environment variable
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('Defina a variável de ambiente OPENAI_API_KEY');
  process.exit(1);
}

const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY }));

async function consultaProcesso(numero_processo) {
  const code = `export default async function({ page, context }) {
    const usuario = '06293234456';
    const senha = 'Simb@280303';
    const numero = context.numero_processo;
    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.goto('https://pje.cloud.tjpe.jus.br/1g/login.seam', { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForSelector('#username', { visible: true, timeout: 30000 });
      await page.waitForSelector('#password', { visible: true, timeout: 30000 });
      await page.type('#username', usuario, { delay: 50 });
      await page.type('#password', senha, { delay: 50 });
      await page.click('#kc-login');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
      await page.goto('https://portaldeservicos.pdpj.jus.br/consulta', { waitUntil: 'networkidle2', timeout: 60000 });
      const token = await page.evaluate(() => localStorage.getItem('access_token'));
      if (!token) {
        return { data: { error: 'access_token nao encontrado' }, type: 'application/json' };
      }
      const url = "https://portaldeservicos.pdpj.jus.br/api/v2/processos/" + numero;
      const resposta = await page.evaluate(async ({ url, token }) => {
        const resp = await fetch(url, { method: 'GET', headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' } });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error('Erro na API PDPJ: ' + resp.status + ' - ' + txt);
        }
        return resp.json();
      }, { url, token });
      return { data: resposta, type: 'application/json' };
    } catch (err) {
      return { data: { error: err.message }, type: 'application/json' };
    }
  }`;

  const response = await axios.post(
    BROWSERLESS_FUNCTION_URL,
    { code, context: { numero_processo } },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data.data;
}

async function resumirProcesso(dados) {
  const prompt = `Resuma o processo a seguir, destacando classe, partes, pedidos, valor da causa e principais movimentacoes:\n\n${JSON.stringify(dados)}`;
  const resp = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Você é um advogado da Midea Carrier. Forneça resumos claros e objetivos.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3
  });
  return resp.data.choices[0].message.content.trim();
}

async function analisarRisco(dados) {
  const prompt = `Analise o risco de perda do seguinte processo e classifique como possivel, remoto ou provavel, com breve justificativa:\n\n${JSON.stringify(dados)}`;
  const resp = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Você é um advogado especialista em contencioso trabalhando para a Midea Carrier.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4
  });
  return resp.data.choices[0].message.content.trim();
}

async function main() {
  const numero = process.argv[2];
  if (!numero) {
    console.error('Uso: node midea_carrier_chatbot.js <numero_processo_cnj>');
    process.exit(1);
  }
  const dados = await consultaProcesso(numero);
  if (dados.error) {
    console.error('Erro:', dados.error);
    return;
  }
  const resumo = await resumirProcesso(dados);
  const analise = await analisarRisco(dados);
  console.log('\n=== Resumo ===\n');
  console.log(resumo);
  console.log('\n=== Analise de Risco ===\n');
  console.log(analise);
}

main().catch(err => console.error('Falha geral:', err));
