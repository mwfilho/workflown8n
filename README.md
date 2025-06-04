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

## Workflows n8n

Além do script Node.js, este repositório contém três arquivos de workflow para importação no n8n:

- `Login_e_ObterToken_ConsultaPDPJ_v2.json` – realiza o login no PJe via Browserless e retorna o JSON do processo.
- `analisar_dados_processo.json` – gera uma análise jurídica do processo utilizando o modelo GPT‑4o.
- `Midea_Carrier_Chatbot.json` – workflow principal que expõe o agente jurídico e utiliza os dois subworkflows anteriores.

Importe os arquivos nessa ordem através do menu **Import workflow** do n8n (versão 1.48.0). Após a importação, o chatbot estará pronto para receber solicitações de consulta de processos e análises.
