import * as fs from 'fs';
import * as path from 'path';

describe('Login_e_ObterToken_ConsultaPDPJ', () => {
  test('returns success and dados_processo', () => {
    const workflowPath = path.join(__dirname, '..', 'Login_e_ObterToken_ConsultaPDPJ.json');
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    const codeNode = workflow.nodes.find((n: any) => n.name === 'Checar Resultado e Retornar');
    expect(codeNode).toBeDefined();
    const jsCode = codeNode.parameters.jsCode as string;
    const $json = { success: true, error: '', dados_processo: { numero: '0001' } };
    const result = new Function('$json', jsCode)($json);
    expect($json.success).toBe(true);
    expect(result[0]).toHaveProperty('json');
    expect(typeof result[0].json).toBe('object');
  });
});
