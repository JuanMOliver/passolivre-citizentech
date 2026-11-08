# PassoLivre · Cidadania em movimento

**Global Solution CitizenTech — FIAP**  
**Desenvolvimento informado:** Juan Marco Oliver · **RM 564575**

> Projeto acadêmico experimental: os relatos são colaborativos e não representam protocolos de fiscalização. Não existe vínculo com órgãos públicos. Registros intitulados **EXEMPLO** são fictícios.

## Links do projeto

- **Plataforma web publicada:** https://passolivre-citizentech.vercel.app/
- **Repositório GitHub:** https://github.com/JuanMOliver/passolivre-citizentech
- **Banco:** Supabase em nuvem, região São Paulo (PostgreSQL e PostgREST)
- **Vídeo-pitch de demonstração final:** ainda precisa ser gravado e publicado; não inventar um link

## Problema e solução

Calçadas danificadas, ausência de rampas e obstáculos dificultam trajetos de idosos, pessoas com deficiência, cuidadores e outros pedestres. O PassoLivre permite registrar problemas no **aplicativo React Native/Expo**, enquanto o **painel web** permite a associações e moradores pesquisar, apoiar e exportar dados da comunidade.

**Integração verificada em dispositivo real em 07/11/2026:** um relato TESTE foi criado no iPhone (Expo Go), persistiu no Supabase, apareceu no site publicado e recebeu um apoio na web, com contagem refletida também no app. O banco usa gatilho para contagem de apoios e políticas **RLS**. Esses resultados são testes funcionais, não uma auditoria completa de segurança ou acessibilidade. Consulte `docs/VALIDACAO_IPHONE_2026-11-07.md`.

## Estrutura

- \`mobile/\` — React Native e Expo; cadastro, navegação, relatos, apoios, permissão GPS opcional, cache e fila offline
- \`web/\` — HTML, CSS, JavaScript puro; indicadores, gráfico de categorias, filtros, apoios e exportação CSV
- \`shared/supabase.sql\` — schema, políticas RLS e trigger de contagem de apoios
- \`docs/TESTAR_NO_IPHONE.md\` — roteiro de execução e teste cruzado
- \`.github/workflows/testes.yml\` — checagem automatizada básica de código no GitHub

## Iniciar no iPhone com Expo Go

No computador com Node.js instalado:

\`\`\`bash
git clone https://github.com/JuanMOliver/passolivre-citizentech.git
cd passolivre-citizentech/mobile
npm install
npx expo install --fix
npx expo login
npx expo start
\`\`\`

1. Instale **Expo Go** na App Store do iPhone.
2. Faça login no **mesmo usuário Expo** no terminal e no Expo Go.
3. Deixe computador e iPhone na **mesma rede Wi-Fi**.
4. Aponte a **Câmera** do iPhone para o QR Code do terminal e abra o projeto no Expo Go.
5. Se não conectar, encerre o servidor (Ctrl+C) e tente \`npx expo start --tunnel\`.

**Compatibilidade (08/11/2026):** o `mobile/package.json` do repositório foi atualizado para **Expo SDK 58** (React Native 0.88 / React 19.3.0). O iPhone já havia executado uma instalação local baseada no SDK 58, mas as versões exatas da instalação local e as dependências versionadas no GitHub não foram comparadas. Após obter esta revisão, rode `npm install`, `npx expo install --check` e valide a execução. Referências: https://expo.dev/changelog/sdk-58 e https://docs.expo.dev/versions/v58.0.0/ .

**Configuração Supabase:** o serviço mobile traz como fallback a URL e uma **chave publishable**, que pode ficar no código público por design. Para usar outro projeto, crie \`mobile/.env\` com \`EXPO_PUBLIC_SUPABASE_URL\` e \`EXPO_PUBLIC_SUPABASE_ANON_KEY\`; não envie essa configuração ao repositório nem use \`service_role\`. A web usa somente a chave publicável em \`web/config.js\`.

## Demonstrar integração na avaliação

1. Abra a web publicada em um computador e a seção **Ocorrências**.
2. No iPhone, no PassoLivre, toque em **Registrar**, preenchendo os campos com um relato identificado como **TESTE**.
3. Envie o relato e atualize o site. O registro deve aparecer na lista.
4. Na web, clique em **Apoiar** no mesmo relato.
5. No app, volte à tela de relatos e confirme o aumento da contagem. A atualização é periódica quando o app está ativo.
6. Grave a tela do iPhone e do site com a integração real, motion design, navegação e acessibilidade.

Caso a conexão caia durante um registro, o app guarda o relato localmente; posteriormente vá à seção **Meus**, botão **Enviar pendências**.

## UX, motion e acessibilidade

Verde profundo e verde-lima representam confiança e participação, com contraste e tipografia clara. O app usa áreas de toque confortáveis, descrição textual de botões, navegação inferior e texto escalonável. A web utiliza HTML semântico, rótulos nos campos, foco visível, comportamento responsivo, realimentação de ações e respeita \`prefers-reduced-motion\`. As microinterações orientam navegação, carregamento e confirmação.

## Relação com os ODS

**ODS 11 — Cidades e Comunidades Sustentáveis**, especialmente meta 11.7 (acesso a espaços públicos inclusivos, seguros e acessíveis). O PassoLivre evidencia barreiras e organiza informação; não substitui o **SP156**: https://sp156.prefeitura.sp.gov.br/portal/.

## Limites e pendências acadêmicas

- **Teste em iPhone real já realizado em 07/11/2026** para abertura, cadastro e sincronização de apoio; faltam capturas, vídeo e testes complementares de acessibilidade, offline e tratamento de falhas.
- Validar com pelo menos três pessoas impactadas, registrar respostas verdadeiras e mudanças realizadas; não inventar entrevistas ou resultados.
- Publicar o **vídeo-pitch final de 2 a 3 minutos** com demonstração verdadeira e adicionar seu link.
- O regulamento exige **2 a 5 integrantes**, mas apenas Juan Marco Oliver foi informado. Confirmar autorização para entrega individual ou completar a equipe.
- Antes de uso público amplo, adicionar moderação, proteção anti-spam e política de privacidade. RLS por si só não substitui esses controles.

**Situação em 08/11/2026:** app iPhone (instalação local SDK 58), Supabase e web passaram nos fluxos de relato e apoio; a configuração do SDK 58 foi publicada no GitHub nesta data. Ainda são necessárias verificação da CI após a mudança, validação com usuários reais, testes complementares, evidências visuais, sincronização com a instalação local e vídeo final.
