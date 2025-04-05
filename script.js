function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'a4'); // Layout paisagem (landscape)

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

    const formattedDate = formatDateToBrazilian(data); 

    const serviceNumber = Math.floor(Math.random() * 9000) + 1000;

    function addContent(doc, yOffset) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("AUTORIZAÇÃO DE SERVIÇO", 150, yOffset - 10, { align: 'center' });

        doc.setTextColor(255, 0, 0); // Define a cor do texto para vermelho
        doc.setFontSize(10);
        doc.text(`Número: ${serviceNumber}`, 150, yOffset - 5, { align: 'center' });

       // Restaura a cor do texto para preto ou a cor original para os próximos textos
       doc.setTextColor(0, 0, 0); // Cor preta para os outros textos
       

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('RJ PNEUS', 7, yOffset + 1);
        doc.setFontSize(9);
        doc.text('RENOVAÇÃO, CONSERTOS EM GERAL', 7, yOffset + 5);
        doc.text('Rua C2 - Bairro Boa Vista, Qd. 16 Lt. 52 e 53 - Luís Eduardo Magalhães - BA', 7, yOffset + 10);
        doc.text('Fone: (77) 9 9924-1468', 7, yOffset + 15);
        doc.text(`CNPJ: 36.881.820/0001-87`, 7, yOffset + 20);

        // Informações do cliente
        doc.setFontSize(9);
        doc.text(`Sr: ${cliente}`, 120, yOffset + 10);
        doc.text(`Placa: ${placa}`, 190, yOffset + 10); 
        doc.text(`Telefone: ${telefone}`, 250, yOffset + 10);
        doc.text(`CNPJ: ${cnpj}`, 120, yOffset + 15); 
        doc.text(`Endereço: ${endereco}`, 190, yOffset + 15);
        doc.text(`Inscrição Estadual: ${inscricaoEstadual}`, 250, yOffset + 15);
        doc.text(`Número: ${numero}`, 120, yOffset + 20);
        doc.text(`Data: ${formattedDate}`, 190, yOffset + 20);
        doc.text(`Município: ${municipio}`, 250, yOffset + 20);

        // Cabeçalho da tabela
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text('Medidas', 20, yOffset + 25);
        doc.text('Marca', 50, yOffset + 25);  
        doc.text('Série', 80, yOffset + 25);  
        doc.text('Lonas', 110, yOffset + 25); 
        doc.text('Discriminação', 140, yOffset + 25); 
        doc.text('Desenho', 170, yOffset + 25);  
        doc.text('Unitário', 200, yOffset + 25);  
        doc.text('Desconto', 230, yOffset + 25);  
        doc.text('Total', 260, yOffset + 25);  

        doc.line(7, yOffset + 22, 295, yOffset + 22);

        let totalGeral = 0;

        const items = document.querySelectorAll('.service-item');
        let yOffsetItems = yOffset + 30;
        let rowCounter = 0;

        items.forEach((item, index) => {
            const medidas = item.querySelector('.medidas').value || '';  
            const marca = item.querySelector('.marca').value || '';  
            const serie = item.querySelector('.serie').value || '';  
            const lonas = item.querySelector('.lonas').value || '';  
            const discriminacao = item.querySelector('.discriminacao').value || '';  
            const desenho = item.querySelector('.desenho').value || '';  
            const unitario = parseFloat(item.querySelector('.unitario').value) || 0;  
            const desconto = parseFloat(item.querySelector('.desconto').value) || 0;  

            const totalComDesconto = lonas * unitario - desconto;

            totalGeral += totalComDesconto || 0;

            doc.setFont("helvetica", "normal");
            doc.text(medidas, 20, yOffsetItems);
            doc.text(marca, 50, yOffsetItems);  
            doc.text(serie, 80, yOffsetItems);  
            doc.text(lonas, 110, yOffsetItems); 
            doc.text(discriminacao, 140, yOffsetItems); 
            doc.text(desenho, 170, yOffsetItems);  
            doc.text(`R$ ${unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 200, yOffsetItems);  
            doc.text(`R$ ${desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 230, yOffsetItems);  
            doc.text(`R$ ${totalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 260, yOffsetItems);  

            yOffsetItems += 3;

            rowCounter++;

            if (rowCounter >= 20) {
                doc.addPage();
                rowCounter = 0;
                yOffsetItems = 20;
            }
        });

        yOffsetItems += 1;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Geral: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 240, yOffsetItems);

        doc.setFontSize(8);
        doc.text('Examinador:', 20, yOffsetItems + 5);
        doc.text('Assinatura:', 80, yOffsetItems + 5);

        // Rodapé fixo em ambas as vias
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const rodapeYPos = yOffsetItems + 5; // Ajustando a posição vertical para a segunda via
        doc.setFontSize(8);
        doc.text(`Lançamento em: ${dateString}`, 230, rodapeYPos); // Rodapé da primeira via
    }

    let yOffset = 20;
    addContent(doc, yOffset);

    doc.line(7, 105, 295, 105);

    yOffset = 120;
    addContent(doc, yOffset);

    // Gerar o PDF
    doc.save('autorizacao_servico.pdf');
}

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
