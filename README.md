# Cadastro de usuários Sisand

Este é um projeto full-stack que utiliza o **SQL Server** como banco de dados e um **front-end em Angular**. O banco de dados é criado utilizando **migrations** no Entity Framework. Abaixo estão os passos para configurar e rodar o projeto corretamente.

## Requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- **.NET Core SDK** (ou .NET Framework, dependendo do seu projeto)
- **SQL Server** (ou um banco de dados SQL Server configurado)
- **Node.js** e **npm** para rodar o projeto Angular

## Passos para configurar o ambiente

1. **Clonar o repositório:**
   Se você ainda não tem o projeto, clone o repositório utilizando o comando:

   ```bash
   git clone <URL do repositório>
2. **Configurar a string de conexão:**
    Certifique-se de que a string de conexão do banco de dados no arquivo appsettings.json  está configurada corretamente para apontar para sua instância do SQL Server.
3. **Executar as migrations para criar o banco de dados:**
   O banco de dados será criado utilizando migrations do Entity Framework. Para gerar e aplicar as migrations, execute os seguintes comandos no terminal:
   ```bash
      dotnet ef migrations add InitialCreate
      dotnet ef database update
4. **Instalar as dependências do Angular:**
  Antes de rodar o projeto Angular, você precisa instalar todas as dependências do projeto listadas no arquivo package.json.
   ```bash
   npm install
5. **Iniciar o servidor Angular**
   O comando npm start é usado para rodar o projeto Angular em um servidor de desenvolvimento. O projeto ficará disponível no navegador em http://localhost:4200, onde você poderá acessar a interface do usuário
   ```bash
      npm start

6. **Conclusão**
   Agora você tem o banco de dados configurado e o projeto Angular e o .NET rodando no seu ambiente local.
   Caso encontre algum problema durante a configuração ou execução, verifique os logs de erro ou consulte a documentação adicional para solucionar problemas comuns.

