# VanVan 

<div align="center">
  <!-- Substitua o link abaixo pela URL da sua imagem de logo -->
  <img src="https://via.placeholder.com/150" alt="Logo VanVan" width="150"/>
  <br>
  <br>
  
  <p>
    Projeto desenvolvido para a disciplina de <b>Engenharia de Software</b> do curso de Ciência da Computação da 
    <b>Universidade Federal do Agreste de Pernambuco (UFAPE)</b>.
  </p>
  
  ![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
  ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
</div>

---

##  Sobre o projeto

Este projeto consiste no desenvolvimento de uma aplicação web utilizando **Java**, **Spring Boot** e **Angular**, como parte da disciplina de Engenharia de Software, ministrada pela professora **Thaís Burity**, na Universidade Federal do Agreste de Pernambuco - UFAPE, durante o semestre de 2025.2.

O objetivo é a implementação de um sistema de gerenciamento para a plataforma **VanVan**, um aplicativo que permite aos usuários realizarem viagens intermunicipais por meio de veículos fretados.

##  Equipe de Desenvolvimento

<table align="center">
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/152096427?v=4" width="100px;" alt="Foto de Letícia Baracho"/><br>
        <sub>
          <b>Letícia Baracho</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/160639776?v=4" width="100px;" alt="Foto de Caua de Souza"/><br>
        <sub>
          <b>Cauã de Souza</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/198010597?v=4" width="100px;" alt="Foto de Matheus Leal"/><br>
        <sub>
          <b>Matheus Leal</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/122371296?v=4" width="100px;" alt="Foto de Melissa Pessoa"/><br>
        <sub>
          <b>Melissa Pessoa</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/85805632?v=4" width="100px;" alt="Foto de Pedro Lucas"/><br>
        <sub>
          <b>Pedro Lucas</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

##  Tecnologias Utilizadas

### Backend
*   ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white) **Java** (versão 25)
*   ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white) **Spring Boot** (versão 4.0.2)
*   ![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat&logo=apache-maven&logoColor=white) **Maven** (Gerenciamento de dependências)

### Frontend
*   ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white) **Angular**
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**
*   ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind**

### Banco de Dados
*   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL**

##  Pré-requisitos

Certifique-se de ter instalado em sua máquina:

*   [Java JDK 25](https://adoptium.net/)
*   [Node.js & NPM](https://nodejs.org/)
*   [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
*   [PostgreSQL](https://www.postgresql.org/)

##  Como Executar

### 1. Backend (API)

```bash
# Clone o repositório
git clone https://github.com/ES-2025-2-Vanvan/vanvan-es.git

# Acesse a pasta do backend
cd backend

# Importante: Configure as credenciais do banco de dados no arquivo src/main/resources/application.properties antes de executar!

# Execute o projeto utilizando o wrapper do Maven
./mvnw spring-boot:run
```

### 2. Frontend (Cliente)

```bash
# Em um novo terminal, acesse a pasta do frontend
cd frontend

# Instale as dependências do projeto
npm install

# Inicie o servidor de desenvolvimento
ng serve
```

##  Como criar uma conta de Administrador

1. Acesse a página de **Cadastro**
2. No campo de **email**, utilize um endereço com o domínio "admin", seguindo o formato: `admin@dominio.com` (exemplo: `admin@vanvan.com`)
3. Preencha os demais campos normalmente
4. Clique em **"Cadastrar"**

> **Nota:** O sistema reconhecerá automaticamente o usuário como administrador com base no domínio do email informado.


O frontend estará acessível em: [http://localhost:4200](http://localhost:4200)



##  Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE.md para detalhes.
