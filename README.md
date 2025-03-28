Projeto: Geração de PDF para Autorização de Serviço
Este projeto é uma aplicação que permite a geração de um PDF com informações sobre um serviço de remoção e conserto de pneus. O objetivo principal é criar uma autorização de serviço que pode ser impressa, com dados sobre o cliente, os itens de serviço e valores.

Funcionalidades
Coleta de Dados do Formulário: A aplicação coleta informações inseridas pelo usuário, como dados do cliente (nome, telefone, endereço, placa, etc.) e detalhes sobre os itens de serviço (medidas, marca, série, lonas, discriminação, desenho, unitário, total).

Geração de PDF: Usando a biblioteca jsPDF, o aplicativo gera um arquivo PDF que contém:

Cabeçalho com informações da empresa.

Informações do cliente.

Tabela com detalhes sobre os itens de serviço, como medidas, marca, série, etc.

Cálculo automático do total.

Data de lançamento e outras observações.

Campos de assinatura do cliente e examinador.

Cálculos Automatizados: O valor total de cada item de serviço é calculado automaticamente a partir dos campos "Lonas" e "Unitário". O total geral é atualizado conforme os itens são adicionados ou removidos.

Adição e Remoção de Itens: O usuário pode adicionar e remover itens de serviço dinamicamente. O valor total é recalculado automaticamente.

Formatação da Data: A data é formatada no padrão brasileiro (DD/MM/YYYY) antes de ser inserida no PDF.

Estrutura do Projeto
Arquivos
HTML: Estrutura do formulário onde o usuário insere as informações do cliente e dos itens de serviço.

CSS: Estilo básico para o layout do formulário.

JavaScript: Lógica principal do projeto, incluindo a coleta de dados, cálculos e geração do PDF.

jsPDF: Biblioteca usada para gerar o PDF.

Funcionalidades do Código
Geração do PDF:

Utiliza a biblioteca jsPDF para criar o documento PDF.

Inclui informações como nome do cliente, telefone, placa, endereço e os itens de serviço.

O total geral é calculado e exibido no rodapé do PDF.

A data de geração do PDF é inserida automaticamente.

Interatividade:

A aplicação permite adicionar e remover itens de serviço dinamicamente.

O cálculo do total de cada item e o total geral é feito automaticamente conforme o usuário insere os valores.

Como Usar
Clone o repositório:

bash
Copiar
git clone https://github.com/seuusuario/gerador-pdf-autorizacao-servico.git
cd gerador-pdf-autorizacao-servico
Abra o arquivo index.html em um navegador.

Preencha os dados no formulário:

Informe os dados do cliente (nome, telefone, endereço, placa, etc.).

Adicione itens de serviço preenchendo as informações de medidas, marca, série, lonas, discriminação, desenho, unitário e total.

Clique no botão para gerar o PDF.

Baixe o arquivo PDF gerado.

Bibliotecas Usadas
jsPDF: Biblioteca JavaScript para gerar arquivos PDF diretamente no navegador. Documentação do jsPDF

Contribuições
Contribuições são bem-vindas! Caso queira adicionar funcionalidades ou corrigir erros, fique à vontade para fazer um fork e enviar um pull request.

Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
