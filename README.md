# PassoLivre — Cidadania em movimento

**Global Solution CitizenTech | FIAP**  
**Aluno:** Juan Marco Oliver — RM 564575

> Projeto acadêmico experimental. Não possui vínculo com a Prefeitura e não substitui o SP156.

## Objetivo

Tornar mais visíveis os obstáculos de acessibilidade nas calçadas. O aplicativo React Native/Expo permite registrar relatos na rua; a plataforma web permite que a comunidade consulte, filtre, apoie e exporte ocorrências.

## Links

- **Web publicada:** https://passolivre-citizentech.vercel.app/
- **Banco de dados:** Supabase (São Paulo), compartilhado entre mobile e web
- **Vídeo-pitch final:** pendente de gravação do aplicativo real e publicação

## Como testar o aplicativo

1. Instale o Node.js.
2. Entre na pasta `mobile/`.
3. Execute `npm install` e `npx expo start`.
4. Instale **Expo Go** no Android ou iPhone.
5. Use o celular para ler o QR Code do terminal e abrir o app.

Os dispositivos precisam ter acesso à internet. O Expo Go é **um ambiente de testes**, não o aplicativo final instalado pela loja; a entrega pode incluir código React Native executável via Expo.

## Integração

As interfaces usam o mesmo projeto Supabase com as tabelas `reports` e `supports`. O banco mantém os dados e as políticas de segurança (RLS). As ocorrências de demonstração estão identificadas como **EXEMPLO**.

## Atenção ao edital

O trabalho ainda precisa de: validação do app em dispositivo real, demonstração audiovisual cruzada app/web, entrevistas com cidadãos e regularização da exigência de equipe de 2 a 5 integrantes (ou autorização institucional para entrega individual).
