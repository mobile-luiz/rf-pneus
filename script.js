function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', 'a4'); // Horizontal layout (landscape)

    // Coletando os dados do formulário
    const cliente = document.getElementById('cliente').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const placa = document.getElementById('placa').value;
    const numero = document.getElementById('numero').value;  // Captura o valor do campo "Número"
    const cnpj = '36.881.820/0001-87'; // CNPJ da empresa
    const inscricaoEstadual = document.getElementById('inscricao-estadual').value;
    const data = document.getElementById('data').value;
    const municipio = document.getElementById('municipio').value;

    // Formatar a data no formato brasileiro (DD/MM/YYYY)
    const formattedDate = formatDateToBrazilian(data);

    // Função para adicionar o conteúdo do PDF
    function addContent(doc, clientLabel) {
        // Adicionando o título "Autorização de Serviço"
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Autorização de Serviço", 105, 20, { align: "center" });

        // Cabeçalho da empresa
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text('RJ PNEUS', 20, 30);
        doc.setFontSize(10);
        doc.text('REMOÇÃO, CONSERTOS EM GERAL', 20, 35);
        doc.text('Rua C2 - Bairro Boa Vista, Qd. 16 Lt. 52 e 53 - Luís Eduardo Magalhães - BA', 20, 40);
        doc.text('Fone: (77) 9 9924-1468', 20, 45);
        doc.text(`CNPJ: 36.881.820/0001-87`, 20, 50);

        // Informações do cliente
        doc.setFontSize(12);
        doc.text(`Sr: ${cliente}`, 180, 20);
        doc.text(`Placa: ${placa}`, 180, 25);
        doc.text(`Telefone: ${telefone}`, 180, 30);
        doc.text(`Endereço: ${endereco}`, 180, 35);
        doc.text(`Inscrição Estadual: ${inscricaoEstadual}`, 180, 40);
        doc.text(`Número: ${numero}`, 180, 45);  // Exibindo o número
        doc.text(`Data: ${formattedDate}`, 180, 50); // Data formatada
        doc.text(`Município: ${municipio}`, 180, 55);

        // Adicionando uma linha para separar o cabeçalho
        doc.line(20, 60, 285, 60);

        // Cabeçalho da tabela
        doc.text('Medidas', 20, 65);
        doc.text('Marca', 55, 65);
        doc.text('Série', 90, 65);
        doc.text('Lonas', 125, 65);
        doc.text('Discriminação', 160, 65);
        doc.text('Desenho', 195, 65);
        doc.text('Unitário', 230, 65);
        doc.text('TOTAL', 265, 65);

        // Estilo de linha
        const lineY = 70;
        doc.line(20, lineY, 285, lineY); // Linha horizontal para separar o cabeçalho

        let totalGeral = 0; // Variável para armazenar o total geral

        // Adicionando os itens de serviço
        const items = document.querySelectorAll('.service-item');
        let yOffset = 75;
        let rowCounter = 0;

        items.forEach((item, index) => {
            const medidas = item.querySelector('.medidas').value;
            const marca = item.querySelector('.marca').value;
            const serie = item.querySelector('.serie').value;
            const lonas = item.querySelector('.lonas').value;
            const discriminacao = item.querySelector('.discriminacao').value;
            const desenho = item.querySelector('.desenho').value;
            const unitario = item.querySelector('.unitario').value;
            const total = item.querySelector('.total').value;

            // Verifica se os campos necessários estão preenchidos antes de adicionar o item
            if (!medidas || !marca || !serie || !lonas || !discriminacao || !desenho || !unitario || !total) {
                return; // Ignora os itens incompletos
            }

            // Atualizando o total geral
            totalGeral += parseFloat(total) || 0;

            // Adiciona os dados na tabela
            doc.text(medidas, 20, yOffset);
            doc.text(marca, 55, yOffset);
            doc.text(serie, 90, yOffset);
            doc.text(lonas, 125, yOffset);
            doc.text(discriminacao, 160, yOffset);
            doc.text(desenho, 195, yOffset);
            doc.text(`R$ ${parseFloat(unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 230, yOffset);
            doc.text(`R$ ${parseFloat(total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 265, yOffset);

            yOffset += 10; // Desloca para a próxima linha

            rowCounter++;

            // Se já tiver 10 itens, inicia uma nova página
            if (rowCounter >= 10) {
                doc.addPage(); // Adiciona nova página
                rowCounter = 0;
                yOffset = 20; // Reseta o yOffset para o início da nova página
            }
        });

        // Linha final para separar os itens do rodapé
        doc.line(20, yOffset + 5, 285, yOffset + 5);

        // Exibindo o total geral no final em negrito
        doc.setFont("helvetica", "bold");
        doc.text(`Total Geral: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, yOffset + 15); // Total à direita

        // Adicionando a data e hora de lançamento ao lado de "Total Geral"
        const downloadDate = new Date();
        const formattedDownloadDate = `${downloadDate.getDate().toString().padStart(2, '0')}/${(downloadDate.getMonth() + 1).toString().padStart(2, '0')}/${downloadDate.getFullYear()} ${downloadDate.getHours().toString().padStart(2, '0')}:${downloadDate.getMinutes().toString().padStart(2, '0')}:${downloadDate.getSeconds().toString().padStart(2, '0')}`;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Lançamento em: ${formattedDownloadDate}`, 20, yOffset + 25); // Data à esquerda

        // Adicionando o campo de desconto (embaixo da tabela)
        doc.setFontSize(10);
        doc.text(`Desconto: R$ 0,00`, 180, yOffset + 35); // Ajuste o valor conforme necessário

        // Adicionando as observações abaixo
        doc.setFontSize(8);
        doc.text("Obs.: As mercadorias que não forem retiradas até 30 dias serão devolvidas para pagamento.", 20, yOffset + 45);
        doc.text("Não garantimos estorno de carga.", 20, yOffset + 50);

        // Adicionando os campos de assinatura (apenas os nomes, sem linha)
        doc.text("Assinatura do Cliente:", 20, yOffset + 65);
        doc.text("Assinatura do Examinador:", 180, yOffset + 65);
    }

    // Gerando a primeira via (Cópia para o Cliente)
    addContent(doc, "Cópia para o Cliente");

    // Adicionando nova página para a segunda via (Cópia para a Loja)
    doc.addPage();
    addContent(doc, "Cópia para a Loja");

    // Salvando o PDF
    doc.save('autorizacao_servico.pdf');
}


// Função para formatar a data no formato brasileiro (DD/MM/YYYY)
function formatDateToBrazilian(date) {
    const [year, month, day] = date.split('-'); // Divida a data no formato YYYY-MM-DD
    return `${day}/${month}/${year}`; // Retorna a data no formato DD/MM/YYYY
}




// Adicionando evento para o botão de adicionar item
document.getElementById('add-service-btn').addEventListener('click', addItem);

// Função para adicionar um novo item de serviço
function addItem() {
    const serviceItemsContainer = document.getElementById('service-items');
    
    const newItem = document.createElement('div');
    newItem.classList.add('service-item');
    
    newItem.innerHTML = `
        <div class="form-group">
            <label for="medidas">Medidas</label>
            <input type="text" class="medidas" name="medidas[]" required>
        </div>
        <div class="form-group">
            <label for="marca">Marca</label>
            <input type="text" class="marca" name="marca[]" required>
        </div>
        <div class="form-group">
            <label for="serie">Série</label>
            <input type="text" class="serie" name="serie[]" required>
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
    item.querySelector('.total').value = total.toFixed(2);
    updateTotal(); // Atualiza o total geral
}

// Função para atualizar o total geral
function updateTotal() {
    const totalFields = document.querySelectorAll('.total');
    let totalValue = 0;

    totalFields.forEach(field => {
        totalValue += parseFloat(field.value) || 0;
    });

    document.getElementById('total-value').innerText = totalValue.toFixed(2);
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
