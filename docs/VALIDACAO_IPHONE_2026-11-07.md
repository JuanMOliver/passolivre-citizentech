# Registro de validação — PassoLivre (07/11/2026, horário de Brasília)

## Testes funcionais confirmados

- **Aplicativo iPhone:** usuário abriu o PassoLivre pelo Expo Go e visualizou a tela inicial com a mensagem “Uma cidade livre começa com você”. Teste realizado em iPhone real, usando SDK 58 instalado localmente.
- **Criação de ocorrência:** usuário cadastrou “Teste FIAP calçada irregular” pelo iPhone e visualizou o item em “Meus relatos” e na tela inicial.
- **Persistência no Supabase:** consulta SQL na tabela `public.reports` confirmou o registro com categoria “Piso irregular” e status “recebido”.
- **Sincronização com a web:** usuário confirmou que o mesmo relato apareceu no painel publicado em https://passolivre-citizentech.vercel.app/ sem recarregar manualmente a página.
- **Apoio:** usuário clicou em “Apoiar” na web e confirmou a contagem sincronizada no iPhone. Consulta SQL confirmou `supports_count = 1` para esse relato.

**Tipo de evidência:** confirmação verbal do usuário + consulta ao banco feita pelo assistente. Capturas de tela e gravação do dispositivo ainda não foram anexadas; portanto, não afirmar que essas evidências visuais já existem.

## Pendências a validar e documentar

- Acessibilidade no iPhone: texto ampliado nas configurações do iOS, VoiceOver, contraste e usabilidade de botões.
- Resiliência: funcionamento da lista e fila offline, retorno da conexão e mensagens de erro.
- Teste visual/responsivo da web em diferentes larguras, com capturas.
- Sincronizar **SDK Expo 58** do aplicativo local testado com o repositório: o `mobile/package.json` remoto ainda apresenta SDK 57 e dependências antigas. Preferir enviar `package.json` e lockfile gerados e testados na máquina, evitando adivinhar versões.
- Confirmar CI do GitHub após sincronização e registrar resultado.
- Documentar entrevistas reais com usuários, equipe exigida, relatório final e vídeo-pitch definitivo. Não fabricar entrevistas ou testes.

## Observações

A integração funcional iPhone ↔ Supabase ↔ web está confirmada para os fluxos de relato e apoio. Isso **não** substitui auditoria geral de segurança, teste completo de acessibilidade, validação com cidadãos nem outros critérios acadêmicos.
