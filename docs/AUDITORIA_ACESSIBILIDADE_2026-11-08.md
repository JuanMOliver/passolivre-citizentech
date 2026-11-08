# Auditoria de acessibilidade — PassoLivre

**Data:** 08/11/2026. **Responsável pela análise:** ChatGPT (verificação automatizada e inspeção de código). **Aplicação:** PassoLivre — FIAP, Juan Marco Oliver, RM 564575.

## Escopo e evidências

- O **código web versionado no GitHub** foi inspecionado para semântica HTML, rótulos, feedback textual, foco visível, responsividade e movimento reduzido.
- Os **testes automatizados de navegação** foram feitos em uma cópia **local de um pacote do projeto**; o pacote possui interface diferente da revisão web atualmente publicada. Foram usados quatro registros obtidos por consulta ao Supabase, mas as requisições de rede no navegador local foram reproduzidas. **Essas capturas NÃO são capturas do domínio da Vercel e não comprovam o acesso público.**
- O ambiente de automação bloqueou acesso direto ao domínio público por navegador. O site foi republicado na Vercel após correção de CSS, e a implantação foi confirmada em estado READY.
- Os testes iPhone → Supabase → web e web → Supabase → iPhone para criação e apoio foram realizados previamente pelo aluno em dispositivo real; não são testes de acessibilidade.

## Resultados (navegador local)

| Verificação | Resultado |
|---|---|
| Renderização de quatro registros consultados no banco | passou (requisições reproduzidas localmente) |
| Navegação para ocorrências e busca por título | passou |
| Detalhes em diálogo com role=dialog | passou |
| Foco transferido para botão fechar no modal | passou |
| Fechamento do modal com Esc | passou |
| Link inicial «Pular para conteúdo» com Tab (página nova) | passou |
| Ausência de rolagem horizontal em 320 px | passou |
| Regras CSS para prefers-reduced-motion | presentes |
| Estrutura semântica main/nav e rótulos em campos | presentes |
| Feedback textual de status no painel | presente |

## Melhoria aplicada no GitHub e publicada na Vercel

Na revisão do CSS web publicado, o texto secundário de cartões em **#6d7c71** sobre branco tinha razão de contraste aproximada de **4,40:1**, ligeiramente abaixo de 4,5:1 (WCAG AA para texto comum). Metadados com **#697e6e** sobre branco tinham aproximadamente **4,37:1**. Ambos foram escurecidos, e o tamanho mínimo foi elevado para 12 px nos seletores relevantes. O placeholder da busca também foi escurecido. Uma nova implantação de produção foi confirmada como **READY**.

**Importante:** não foi executada auditoria automatizada completa com axe-core sobre a implantação real; não declare conformidade integral com WCAG.

## Testes pendentes em dispositivo físico

1. VoiceOver no iPhone: navegação e leitura de rótulos, campos, mensagens e botões.
2. Texto ampliado (iOS Ajustes > Acessibilidade > Tela e Tamanho do Texto > Texto Maior): verificar truncamento, sobreposição e uso em cada tela.
3. Uso sem internet: mensagens e fila offline; validar sincronização quando a rede voltar.
4. Safari e Chrome em dispositivos reais: zoom, teclado e navegação, inclusive no painel web publicado.
5. Obter capturas reais da URL pública e vídeos do fluxo completo.

## Limites

Este documento separa **observação real**, **teste local reproduzido** e **validação pendente**. Registros de demonstração são fictícios, marcados como TESTE ou EXEMPLO. Não inventar depoimentos de usuários nem usar capturas simuladas como se fossem da implantação pública.
