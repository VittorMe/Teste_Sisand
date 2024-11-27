# Cadastro de usuários Sisand

Este é um projeto full-stack que utiliza o **SQL Server** como banco de dados e um **front-end em Angular**. O banco de dados é criado utilizando **migrations** no Entity Framework. Abaixo estão os passos para configurar e rodar o projeto corretamente.

## Requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- **.NET Core SDK** (ou .NET Framework, dependendo do seu projeto)
- **SQL Server** (ou um banco de dados SQL Server configurado)
- **Node.js** e **npm** para rodar o projeto Angular

## Passos para configurar o banco de dados (SQL Server)

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

```bash
   dotnet ef database update
