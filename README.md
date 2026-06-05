# CthulhuTracker

**Rastreador de Iniciativa para Chamado de Cthulhu 7ª Edição**

## Sobre

CthulhuTracker é uma ferramenta web para gerenciar a ordem de iniciativa em
combates do sistema Chamado de Cthulhu 7ª Edição. Funciona inteiramente no
navegador, sem necessidade de servidor ou instalação.

## Funcionalidades

### Dois Modos de Uso

**🎲 Nova Iniciativa**
- Adicione personagens com nome e valor de DES (Destreza)
- Selecione Vantagem ou Desvantagem por personagem
- Rolagem automática de d100 com cálculo de nível de sucesso
- Ordenação automática seguindo as regras do sistema

**📋 Iniciativa Existente**
- Insira personagens com posição manual na ordem
- Ideal para quando a iniciativa já foi definida fora do sistema

### Tela de Combate
- Contador de rodadas automático
- Indicador visual do personagem atual
- Botão "Próximo Personagem" para avançar turnos
- Botões para mover personagens na ordem (↑ ↓)
- Finalizar combate com confirmação

### Sistema de Sucessos
| Resultado | Nível |
|---|---|
| 1 | Sucesso Crítico |
| ≤ 1/5 da perícia | Sucesso Extremo |
| ≤ 1/2 da perícia | Sucesso Bom |
| ≤ perícia | Sucesso Normal |
| > perícia | Fracasso |
| 100 | Falha Crítica |

### Vantagem / Desvantagem
- **Vantagem:** rola 2d100, usa o menor
- **Desvantagem:** rola 2d100, usa o maior

### Desempate
Em caso de empate no nível de sucesso, o personagem com DES mais alta vence.

## Como Usar

1. Faça upload dos arquivos para um repositório GitHub
2. Ative o GitHub Pages
3. Acesse o site gerado

## Estrutura
