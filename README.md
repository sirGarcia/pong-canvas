# Jogo Pong Multiplayer

## Descrição

Este projeto é uma implementação de um jogo Pong multiplayer clássico, desenvolvido para ser jogado por dois jogadores através da rede. O frontend do jogo é construído utilizando tecnologias web padrão como HTML, CSS e JavaScript, garantindo uma interface de usuário simples e responsiva diretamente no navegador. O backend, desenvolvido em Java, é responsável pela lógica do servidor, gerenciamento das partidas multiplayer e comunicação em tempo real entre os jogadores.

## Tecnologias Utilizadas

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (puro)
*   **Backend:**
    *   Java

## Setup do Projeto

Para executar este projeto, você precisará configurar tanto o frontend quanto o backend separadamente.

### Backend (Java)

1.  **Pré-requisitos:**
    *   Java Development Kit (JDK) instalado (versão recomendada: 8 ou superior).
    *   Ambiente de desenvolvimento Java de sua preferência (ex: IntelliJ IDEA, Eclipse, etc.) ou linha de comando.

2.  **Compilação e Execução:**

    *   Navegue até o diretório raiz do backend (onde se encontra o arquivo `pom.xml` ou arquivos de compilação Java).
    *   Utilizando o Maven (se o projeto for Maven):
        ```bash
        mvn clean install
        mvn spring-boot:run
        ```
    *   Ou, se estiver utilizando um IDE, importe o projeto e execute a classe principal que inicia o servidor backend.
    *   O servidor backend Java será iniciado e estará pronto para receber conexões. Verifique o console para a URL e porta em que o servidor está rodando (ex: `http://localhost:8080`).

### Frontend (HTML, CSS, JavaScript)

1.  **Pré-requisitos:**
    *   Nenhum pré-requisito especial além de um navegador web moderno (ex: Chrome, Firefox, Safari).

2.  **Execução:**

    *   Navegue até o diretório que contém os arquivos do frontend (arquivos `HTML`, `CSS` e `JS`).
    *   Abra o arquivo `index.html` (ou o arquivo HTML principal do seu projeto) diretamente no seu navegador web.
    *   O frontend do jogo será carregado no navegador. Certifique-se de que o backend Java esteja rodando para a funcionalidade multiplayer.

## Como Jogar

1.  **Inicie o Backend:** Certifique-se de que o servidor backend Java esteja em execução antes de iniciar o frontend.
2.  **Abra o Frontend no Navegador:** Abra o arquivo `index.html` (ou similar) em dois navegadores diferentes (ou abas, se desejar jogar na mesma máquina para teste).
3.  **Multiplayer:**
    *   Cada navegador representará um jogador diferente.
    *   O frontend irá se conectar ao backend Java para sincronizar o estado do jogo entre os jogadores.
    *   Utilize os controles na tela para mover sua raquete e jogar Pong contra outro jogador.

## Funcionalidade Multiplayer

*   **Conexão em Tempo Real:** Comunicação entre os jogadores e o servidor backend é realizada em tempo real, permitindo uma experiência de jogo fluida e responsiva.
*   **Sincronização do Jogo:** O backend Java gerencia o estado do jogo, garantindo que ambos os jogadores vejam a mesma partida simultaneamente.
*   **Partidas 1v1:** Projetado para partidas de Pong um contra um.

## Readme Gerado

Este Readme foi gerado para auxiliar no uso e entendimento do projeto Pong Multiplayer. Para mais detalhes sobre funcionalidades específicas, configurações ou para contribuir com o projeto, consulte a documentação detalhada do código e os comentários.