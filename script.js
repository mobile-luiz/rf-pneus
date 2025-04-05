// Função para gerar o PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Layout retrato (portrait) com tamanho A4

    // Coletando os dados do formulário
    const cliente = document.getElementById('cliente').value || ''; 
    const telefone = document.getElementById('telefone').value || ''; 
    const endereco = document.getElementById('endereco').value || ''; 
    const placa = document.getElementById('placa').value || ''; 
    const numero = document.getElementById('numero').value || ''; 
    const cnpj = document.getElementById('cnpj').value || ''; 
    const inscricaoEstadual = document.getElementById('inscricao-estadual').value || ''; 
    const data = document.getElementById('data').value || new Date().toISOString().slice(0, 10); 
    const municipio = document.getElementById('municipio').value || ''; 

    // Formatação da data para o formato brasileiro (dd/mm/yyyy)
    const formattedDate = formatDateToBrazilian(data); 

    // Gerando um número de serviço aleatório
    const serviceNumber = Math.floor(Math.random() * 9000) + 1000;

    // Função para adicionar conteúdo ao PDF
    function addContent(doc, yOffset) {
        // Pegando a largura e altura da página para ajustar o conteúdo
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Ajustando a fonte para o título "AUTORIZAÇÃO DE SERVIÇO"
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("AUTORIZAÇÃO DE SERVIÇO", pageWidth / 2, yOffset - 10, { align: 'center' });

        // Número de serviço em vermelho
        doc.setTextColor(255, 0, 0); 
        doc.setFontSize(10);
        doc.text(`Número: ${serviceNumber}`, pageWidth / 2, yOffset - 5, { align: 'center' });
        doc.setTextColor(0, 0, 0); // Voltando a cor para preto para os outros textos

        // Informações da empresa (nome, endereço, telefone, etc)
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('RJ PNEUS', 10, yOffset + 1);
        doc.setFontSize(9);
        doc.text('RENOVAÇÃO, CONSERTOS EM GERAL', 10, yOffset + 5);
        doc.text('Rua C2 - Bairro Boa Vista, Qd. 16 Lt. 52 e 53 - Luís Eduardo Magalhães - BA', 10, yOffset + 10);
        doc.text('Fone: (77) 9 9924-1468', 10, yOffset + 15);
        doc.text(`CNPJ: 36.881.820/0001-87`, 10, yOffset + 20);

        // Informações do cliente (nome, placa, telefone, etc)
        doc.setFontSize(9);
        doc.text(`Sr: ${cliente}`, pageWidth / 20, yOffset + 25);
        doc.text(`Placa: ${placa}`, pageWidth - 140, yOffset + 25); 
        doc.text(`Telefone: ${telefone}`, pageWidth - 140, yOffset + 30);
        doc.text(`CNPJ: ${cnpj}`, pageWidth / 20, yOffset + 30); 
        doc.text(`Endereço: ${endereco}`, pageWidth - 140, yOffset + 35);
        doc.text(`Inscrição Estadual: ${inscricaoEstadual}`, pageWidth - 80, yOffset + 25);
        doc.text(`Número: ${numero}`, pageWidth / 20, yOffset + 35);
        doc.text(`Data: ${formattedDate}`, pageWidth - 80, yOffset + 30);
        doc.text(`Município: ${municipio}`, pageWidth - 80, yOffset + 35);

        // Cabeçalho da tabela (títulos das colunas)
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text('Medidas', 10, yOffset + 40);
        doc.text('Marca', 30, yOffset + 40);  
        doc.text('Série', 50, yOffset + 40);  
        doc.text('Lonas', 60, yOffset + 40); 
        doc.text('Discriminação', 80, yOffset + 40); 
        doc.text('Desenho', 110, yOffset + 40);  
        doc.text('Unitário', 130, yOffset + 40);  
        doc.text('Desconto', 150, yOffset + 40);  
        doc.text('Total', 180, yOffset + 40);  

        // Linha de separação para a tabela
        doc.line(7, yOffset + 36, pageWidth - 7, yOffset + 36);

        let totalGeral = 0; // Total geral para a soma dos itens
        const items = document.querySelectorAll('.service-item'); // Coletando todos os itens de serviço
        let yOffsetItems = yOffset + 45; // Posição inicial para os itens da tabela
        let rowCounter = 0; // Contador de linhas

        // Loop para cada item de serviço
        items.forEach((item, index) => {
            // Pegando os valores dos campos de cada item
            const medidas = item.querySelector('.medidas').value || '';  
            const marca = item.querySelector('.marca').value || '';  
            const serie = item.querySelector('.serie').value || '';  
            const lonas = item.querySelector('.lonas').value || '';  
            const discriminacao = item.querySelector('.discriminacao').value || '';  
            const desenho = item.querySelector('.desenho').value || '';  
            const unitario = parseFloat(item.querySelector('.unitario').value) || 0;  
            const desconto = parseFloat(item.querySelector('.desconto').value) || 0;  

            const totalComDesconto = lonas * unitario - desconto; // Calculando o total com desconto
            totalGeral += totalComDesconto || 0; // Atualizando o total geral

            // Adicionando os valores na tabela
            doc.setFont("helvetica", "normal");
            doc.text(medidas, 10, yOffsetItems);
            doc.text(marca, 30, yOffsetItems);  
            doc.text(serie, 50, yOffsetItems);  
            doc.text(lonas, 60, yOffsetItems); 
            doc.text(discriminacao, 80, yOffsetItems); 
            doc.text(desenho, 110, yOffsetItems);  
            doc.text(`R$ ${unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 130, yOffsetItems);  
            doc.text(`R$ ${desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, yOffsetItems);  
            doc.text(`R$ ${totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, yOffsetItems);  

            yOffsetItems += 5; // Aumenta a posição para a próxima linha
            rowCounter++; // Incrementa o contador de linhas

            // Se o número de linhas atingir o limite (20), adiciona uma nova página
            if (rowCounter >= 20) {
                doc.addPage(); // Adiciona uma nova página quando atingir o limite de linhas
                rowCounter = 0; // Reseta o contador de linhas
                yOffsetItems = 20; // Resetar a posição da nova página
            }
        });

        // Adicionando o total geral ao final da tabela
        yOffsetItems += 5; 
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Geral: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 60, yOffsetItems);

        // Adicionando os campos "Examinador" e "Assinatura"
        doc.setFontSize(8);
        doc.text('Examinador:', 10, yOffsetItems + 5);
        doc.text('Assinatura:', 60, yOffsetItems + 5);

        // Rodapé fixo com a data de lançamento
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const rodapeYPos = yOffsetItems + 5; // Posicionamento do rodapé
        doc.setFontSize(8);
        doc.text(`Lançamento em: ${dateString}`, pageWidth - 60, rodapeYPos); 
    }

    let yOffset = 20;
    addContent(doc, yOffset); // Adiciona o conteúdo à primeira página

    // Linha de separação
    doc.line(7, 150, doc.internal.pageSize.width - 7, 150);

    yOffset = 165;
    addContent(doc, yOffset); // Adiciona o conteúdo à segunda página

    // Gerar o PDF
    doc.save('autorizacao_servico.pdf');
}

// Função para formatar a data no formato brasileiro (dd/mm/yyyy)
function formatDateToBrazilian(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}




// Inicializa a contagem de cliques
let clickCount = 0;

// Limite máximo de serviços
const maxServices = 14;

// Função para adicionar um item de serviço
document.getElementById('add-service-btn').addEventListener('click', function() {
    // Verifica se o número máximo de cliques foi atingido (14)
    if (clickCount >= maxServices) {
        // Desabilita o botão após 10 cliques
        this.disabled = true;
        alert('Você atingiu o limite de 14 serviços.');
        return; // Impede o código de adicionar mais serviços
    }

    // Adiciona um novo item de serviço
    addItem();  // Esta função deve ser a responsável por adicionar um item (como no seu código original)

    // Incrementa o contador de cliques
    clickCount++;
});

// Função para adicionar um item de serviço
function addItem() {
    const serviceItemsContainer = document.getElementById('service-items');

    // Verifique se já existe o número máximo de itens
    if (serviceItemsContainer.childElementCount >= maxServices) {
        return; // Não adiciona mais itens se já atingiu o limite
    }

    const newItem = document.createElement('div');
    newItem.classList.add('service-item');
    
    newItem.innerHTML = `
        <div class="form-group">
            <label for="medidas">Medidas</label>
            <input type="number" class="medidas" name="medidas[]" required>
        </div>
        <div class="form-group">
            <label for="marca">Marca</label>
            <input type="text" class="marca" name="marca[]" required>
        </div>
        <div class="form-group">
            <label for="serie">Série</label>
            <input type="number" class="serie" name="serie[]" required>
        </div>
        <div class="form-group">
            <label for="lonas">Lonas</label>
            <input type="number" class="lonas" name="lonas[]" required>
        </div>
        <div class="form-group">
            <label for="discriminacao">Discriminação</label>
            <input type="text" class="discriminacao" name="discriminacao[]" required>
        </div>
        <div class="form-group">
            <label for="desenho">Desenho</label>
            <input type="text" class="desenho" name="desenho[]" required>
        </div>
        <div class="form-group">
            <label for="unitario">Unitário</label>
            <input type="number" class="unitario" name="unitario[]" required>
        </div>

        <div class="form-group">
            <label for="desconto">Desconto (R$):</label>
            <input type="number" class="desconto" name="desconto[]" value="0" step="0.01" min="0" onchange="applyDiscount(this)">
          </div>


        <div class="form-group">
            <label for="total">Total</label>
            <input type="number" class="total" name="total[]" readonly>
        </div>
        <button type="button" class="remove-item-btn" onclick="removeItem(this)">Remover Item</button>
    `;
    
    serviceItemsContainer.appendChild(newItem);

    newItem.querySelector('.lonas').addEventListener('input', () => calculateTotal(newItem));
    newItem.querySelector('.unitario').addEventListener('input', () => calculateTotal(newItem));
}

// Função para calcular o total automaticamente para cada item
function calculateTotal(item) {
    const lonas = parseFloat(item.querySelector('.lonas').value) || 0;
    const unitario = parseFloat(item.querySelector('.unitario').value) || 0;

    const total = lonas * unitario;
    item.querySelector('.total').value = total.toFixed(2);  // Mantém o valor com 2 casas decimais

    // Atualiza o total geral
    updateTotal(); 
}



// Função para aplicar o desconto
function applyDiscount(input) {
    // Obter o item de serviço relacionado a este campo
    const item = input.closest('.service-item');
    
    const lonas = parseFloat(item.querySelector('.lonas').value) || 0;
    const unitario = parseFloat(item.querySelector('.unitario').value) || 0;
    const desconto = parseFloat(input.value) || 0;

    const total = lonas * unitario;
    const totalComDesconto = total - desconto;  // Subtrai o desconto do total

    // Atualiza o campo de total com desconto
    item.querySelector('.total').value = totalComDesconto.toFixed(2);  // Atualiza o total com desconto

    // Atualiza o total geral
    updateTotal();
}

// Função para atualizar o total geral
function updateTotal() {
    const totalFields = document.querySelectorAll('.total');
    let totalValue = 0;

    totalFields.forEach(field => {
        totalValue += parseFloat(field.value) || 0;
    });

    // Exibindo o total formatado corretamente
    document.getElementById('total-value').innerText = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


// Função para atualizar o total geral
function updateTotal() {
    const totalFields = document.querySelectorAll('.total');
    let totalValue = 0;

    totalFields.forEach(field => {
        totalValue += parseFloat(field.value) || 0;
    });

    // Exibindo o total formatado corretamente
    document.getElementById('total-value').innerText = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Função para remover um item de serviço
function removeItem(button) {
    const item = button.closest('.service-item');
    item.remove();
    updateTotal(); // Atualiza o total geral após remoção
}


// Adicionando evento para o botão de gerar PDF
document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault(); // Previne o envio do formulário
    generatePDF(); // Gera o PDF
});
