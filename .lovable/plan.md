## Plano de implementação — Expansão Personal Digital

A solicitação tem ~50 funcionalidades novas em 8 grupos. Vou entregar em **6 fases**, todas com dados locais (sem backend), respeitando a separação Básico vs Premium (R$ 29,90/mês) já existente.

### Fase 1 — Coach Diário (Diferencial principal) ⭐
Nova rota `/app/coach` (e card destaque no Dashboard) com resumo matinal:
- Saudação + dia da jornada
- Meta do dia (treino programado, refeição-foco, água restante)
- Dica alimentar rotativa
- Frase motivacional do dia (pool de 60+ frases, seleção determinística por data)
- Botão "Marcar dia como concluído"

### Fase 2 — Alimentação avançada (Premium)
Extensão de `app.nutrition.tsx` + nova rota `/app/nutrition/shopping`:
- Lista de compras gerada da dieta (agrupada por categoria, marcar comprado)
- Troca de refeição por alternativa equivalente (banco de 4 alternativas por refeição com kcal próximos)
- Registro de refeições consumidas (check + horário)
- Controle de proteína diária (barra de progresso vs meta)
- Controle de refeições livres (1/semana Básico, 2/semana Premium)
- Placeholder visual "Leitor de código de barras (em breve)"

### Fase 3 — Saúde & Bem-estar
Nova rota `/app/health` (aba no BottomNav substituindo conforme necessário):
- Sono (horas + qualidade)
- Humor (já parcial em check-in, consolidar gráfico)
- Estresse (1-5)
- Pressão arterial (sistólica/diastólica + histórico)
- Glicemia (opcional, ativável no perfil)
- Lembrete de medicamentos (nome, horário, frequência — usa Notification API)
- Consumo de álcool (doses/semana)

### Fase 4 — Evolução ampliada (Premium)
Expansão de `app.progress.tsx`:
- Gráfico de peso (já existe) + gráficos de medidas (cintura, quadril, braço, peito)
- Linha do tempo (timeline vertical de eventos: treinos, medições, conquistas)
- Comparação mensal automática (mês atual vs anterior)
- Previsão de meta atingida (regressão linear simples)
- Relatório mensal (resumo em card; PDF fica para fase futura)

### Fase 5 — Motivação & Gamificação
Extensão de `gamification.ts` + nova rota `/app/missions`:
- Frase motivacional diária (compartilha pool com Coach)
- Missões diárias (3 por dia, geradas por perfil)
- Sistema de XP (+10 check-in, +20 treino, +5 hábito, +50 missão)
- Níveis (1→100 com curva XP² × 50)
- Medalhas expandidas (16 conquistas)
- Calendário de streak (heatmap mensal 7×N)
- Desafios semanais (Premium — 1 por semana, ex.: "7 dias seguidos de água")

### Fase 6 — Recursos SaaS & Comunidade (placeholders)
- Tema claro/escuro com toggle no Perfil (variáveis CSS já em oklch)
- Personalização de cor primária (3 presets: lime, sky, violet)
- Exportação PDF (jspdf — relatório de evolução)
- Compartilhamento WhatsApp (Web Share API + fallback wa.me)
- Múltiplos objetivos (até 3 metas no Premium)
- Comunidade: tela "Em breve" com lista das features (Compartilhar, Grupos, Ranking, Indicação, Recompensas) — placeholders visuais elegantes, sem backend
- Backup na nuvem / Sincronização: cards "Em breve — requer login na nuvem"

### Detalhes técnicos
- **Store (`pd-store.ts`)**: novos campos opcionais em `Plan`: `meals` expandido para `MealLog[]`, `shopping`, `health` (sleep/mood/stress/pressure/glucose/alcohol), `medications`, `xp`, `level`, `missions`, `challenges`, `freeMeals`, `theme`, `accentColor`, `extraGoals`.
- **Backwards compat**: todos campos novos opcionais, com fallbacks. Planos antigos continuam carregando.
- **Gamificação**: helpers `addXP(amount)`, `levelFor(xp)`, `xpToNext(level)`.
- **Notificações**: helper `scheduleReminder(name, time)` usando `setTimeout` + `Notification API` (já com permissão pedida no Perfil).
- **Frases/dicas**: arquivos `src/lib/quotes.ts` (60 frases) e `src/lib/tips.ts` (40 dicas), seleção `array[dayOfYear % length]`.
- **PDF**: `bun add jspdf` (verificado compatível com Workers — só usado no cliente).
- **Theme toggle**: classe `light`/`dark` no `<html>`, variáveis em `styles.css`.
- **BottomNav**: passa para 5 abas: Início · Diário · Treino · Saúde · Perfil. Alimentação/Evolução/Coach acessíveis pelo Dashboard.

### Gating Básico vs Premium
- **Básico**: Coach diário, frases, missões (1/dia), 1 medicamento, registro básico de saúde, lista de compras de 1 dia.
- **Premium**: tudo ilimitado, troca de refeições, gráficos avançados, previsão de meta, desafios semanais, PDF, temas, múltiplos objetivos, comunidade.

### Ordem de entrega
Sugiro começar pela **Fase 1 (Coach Diário)** que é o diferencial declarado, seguida de **Fase 5 (XP/níveis/missões)** que dá retorno visual imediato, depois Fases 2 → 3 → 4 → 6.

**Posso começar pela Fase 1 + 5 já neste turno?** Ou prefere ordem diferente / todas as fases de uma vez (resposta mais longa)?
