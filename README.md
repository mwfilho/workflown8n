# Midea Carrier Jurídico Chatbot

Este repositório apresenta um exemplo de chatbot em Node.js que utiliza Puppeteer via Browserless e a API do PDPJ para consultar processos judiciais do PJe. O código em `midea_carrier_chatbot.js` executa o login automático no PJe, obtém o `access_token` armazenado no `localStorage` do portal do PDPJ e realiza a consulta do processo.

## Dependências

- Node.js
- Pacotes: `axios`, `openai`, `puppeteer`

Instale executando:

```bash
npm install
```

## Utilização

Defina a chave da API da OpenAI na variável `OPENAI_API_KEY` e execute:

```bash
node midea_carrier_chatbot.js <número_do_processo_CNJ>
```

O script retorna um resumo do processo e uma análise de risco produzidos pela IA.

## Observações

O login no PJe utiliza as credenciais de exemplo presentes no workflow original e o endpoint público do Browserless. Em cenários reais recomenda‑se utilizar variáveis de ambiente ou credenciais seguras.
