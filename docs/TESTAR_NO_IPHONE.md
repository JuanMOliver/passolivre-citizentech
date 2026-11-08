# PassoLivre no iPhone (Expo Go)

**Autor:** Juan Marco Oliver — RM 564575

## Requisitos

- Um computador com Windows, macOS ou Linux e Node.js instalado.
- Um iPhone conectado ao mesmo Wi-Fi do computador.
- O aplicativo Expo Go na App Store.
- Uma conta gratuita Expo, com login no iPhone e no terminal.

## Passo a passo

1. Baixe o repositório GitHub (Code → Download ZIP) e extraia.
2. No terminal do VS Code entre na pasta `mobile`: `cd mobile`.
3. Execute `npm install`.
4. Execute `npx expo install --fix`.
5. Execute `npx expo login` e entre na sua conta Expo.
6. Abra o Expo Go no iPhone e entre **na mesma conta Expo**.
7. Execute `npx expo start` no terminal.
8. Aponte a câmera do iPhone para o QR Code exibido e abra no Expo Go.
9. Se não conectar, tente `npx expo start --tunnel`.

**Compatibilidade (08/11/2026):** o repositório declara Expo SDK 58 / React Native 0.88 / React 19.3.0. A versão local com SDK 58 foi aberta e testada em iPhone em 07/11/2026. A configuração remota foi atualizada depois desse teste, portanto ainda é preciso verificar que um clone limpo da revisão remota instala e funciona no dispositivo. Consulte https://expo.dev/changelog/sdk-58 .

## Teste da integração

1. Abra a web: https://passolivre-citizentech.vercel.app
2. No iPhone toque em **Registrar** e cadastre uma ocorrência com dados de teste claramente marcados.
3. Na web, abra **Ocorrências**, clique **Atualizar dados**, localize o relato.
4. Clique em **Apoiar** na web. No app abra **Relatos** ou retorne ao aplicativo e confirme a contagem.
5. Grave a tela do iPhone e a web para o pitch acadêmico.

A internet e a URL Supabase devem estar disponíveis. Expo Go é um ambiente de testes; ainda não é um app de App Store. Não invente entrevistas ou relatos reais.

## Registro de teste realizado

Em 07/11/2026, o relato de teste `Teste FIAP calçada irregular` foi criado num iPhone (SDK 58 local), apareceu na web publicada e teve `1 apoio` sincronizado entre web, banco e app, conforme `docs/VALIDACAO_IPHONE_2026-11-07.md`. Capturas e gravação ainda não anexadas.

## Testes que não foram afirmados como aprovados

Ampliação de texto, VoiceOver, fila offline e reconexão, testes de uso por participantes externos e compilação da revisão GitHub após migração para SDK 58. Esses itens devem ser executados e registrados honestamente.
