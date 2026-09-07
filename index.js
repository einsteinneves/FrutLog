// ==========================================
// FRUTLOG - SELEÇÃO E GERENCIAMENTO DOS TALHÕES
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // Seleção dos Botões e dos Polígonos no Mapa
    const botoesTalhao = document.querySelectorAll(".btn-talhao");
    const talhoesMapa = document.querySelectorAll(".talhao-mapa");

    // ==========================================
    // DADOS DOS TALHÕES
    // ==========================================
    const dadosTalhoes = {
        A1: {
            cultura: "Uva",
            variedade: "Uva Isabel",
            area: "10 hectares",
            solo: "Arenoso",
            plantio: "15/03/2026",
            colheita: "20/10/2026",
            temperatura: "31 °C",
            umidade: "68 %",
            precipitacao: "2,4 mm",
            vento: "12 km/h",
            mensal: [
                { temp: "30°C", umidAr: "65%", umidSolo: "45%", chuva: "12mm", prev: "Out/2026", qtd: "25t" },
                { temp: "31°C", umidAr: "68%", umidSolo: "42%", chuva: "8mm", prev: "Out/2026", qtd: "28t" }
            ]
        },

        A2: {
            cultura: "Manga",
            variedade: "Tommy Atkins",
            area: "8 hectares",
            solo: "Franco Arenoso",
            plantio: "10/02/2026",
            colheita: "18/09/2026",
            temperatura: "33 °C",
            umidade: "61 %",
            precipitacao: "1,8 mm",
            vento: "14 km/h",
            mensal: [
                { temp: "32°C", umidAr: "60%", umidSolo: "38%", chuva: "5mm", prev: "Set/2026", qtd: "40t" },
                { temp: "33°C", umidAr: "61%", umidSolo: "35%", chuva: "2mm", prev: "Set/2026", qtd: "42t" }
            ]
        },

        B1: {
            cultura: "Uva",
            variedade: "Sugar Crisp",
            area: "9 hectares",
            solo: "Arenoso",
            plantio: "05/02/2026",
            colheita: "25/09/2026",
            temperatura: "30 °C",
            umidade: "72 %",
            precipitacao: "3,1 mm",
            vento: "10 km/h",
            mensal: [
                { temp: "29°C", umidAr: "70%", umidSolo: "50%", chuva: "15mm", prev: "Set/2026", qtd: "30t" },
                { temp: "30°C", umidAr: "72%", umidSolo: "48%", chuva: "10mm", prev: "Set/2026", qtd: "35t" }
            ]
        },

        B2: {
            cultura: "Melão",
            variedade: "Goldex",
            area: "7,6 hectares",
            solo: "Franco Arenoso",
            plantio: "20/01/2026",
            colheita: "15/09/2026",
            temperatura: "35 °C",
            umidade: "54 %",
            precipitacao: "0,8 mm",
            vento: "16 km/h",
            mensal: [
                { temp: "34°C", umidAr: "55%", umidSolo: "30%", chuva: "0mm", prev: "Set/2026", qtd: "18t" },
                { temp: "35°C", umidAr: "54%", umidSolo: "28%", chuva: "1mm", prev: "Set/2026", qtd: "20t" }
            ]
        }
    };

    // ==========================================
    // ATUALIZAÇÃO DA TABELA MENSAL
    // ==========================================
    function atualizarTabelaMensal(dadosMensais) {
        const tabelaCorpo = document.getElementById("tabela-talhao");
        if (!tabelaCorpo) return;

        if (!dadosMensais || dadosMensais.length === 0) {
            tabelaCorpo.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #888;">
                        Nenhum dado cadastrado para este talhão.
                    </td>
                </tr>`;
            return;
        }

        tabelaCorpo.innerHTML = dadosMensais.map(item => `
            <tr>
                <td>${item.temp}</td>
                <td>${item.umidAr}</td>
                <td>${item.umidSolo}</td>
                <td>${item.chuva}</td>
                <td>${item.prev}</td>
                <td>${item.qtd}</td>
            </tr>
        `).join("");
    }

    // ==========================================
    // FUNÇÃO PRINCIPAL DE SELEÇÃO
    // ==========================================
    function selecionarTalhao(nomeTalhao) {

        console.log("Talhão selecionado:", nomeTalhao);

        // 1. Atualiza classe 'active' nos Botões
        botoesTalhao.forEach(botao => {
            if (botao.dataset.talhao === nomeTalhao) {
                botao.classList.add("active");
            } else {
                botao.classList.remove("active");
            }
        });

        // 2. Atualiza classe 'selecionado' nas áreas do Mapa
        talhoesMapa.forEach(talhao => {
            if (talhao.dataset.talhao === nomeTalhao) {
                talhao.classList.add("selecionado");
            } else {
                talhao.classList.remove("selecionado");
            }
        });

        // 3. Obtém dados do talhão selecionado
        const dados = dadosTalhoes[nomeTalhao];
        if (!dados) {
            console.error("Dados não encontrados para o talhão:", nomeTalhao);
            return;
        }

        // 4. ATUALIZA O TÍTULO DO CARTÃO DE DETALHES (H2)
        const tituloTalhao = document.querySelector(".titulo-talhao");
        if (tituloTalhao) {
            tituloTalhao.textContent = `Detalhes: Talhão ${nomeTalhao}`;
        }

        // 5. Atualiza os campos de texto no cartão de detalhes
        const mapaCampos = {
            "talhao-area": dados.area,
            "talhao-solo": dados.solo,
            "talhao-plantio": dados.plantio,
            "talhao-colheita": dados.colheita,
            "talhao-produto": dados.variedade
        };

        Object.entries(mapaCampos).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = valor;
        });

        // 6. Atualiza dados dos sensores no Clima (se existirem os IDs na tela)
        const mapaClima = {
            "temp-valor": dados.temperatura,
            "umidade-valor": dados.umidade,
            "precipitacao-valor": dados.precipitacao,
            "vento-valor": dados.vento
        };

        Object.entries(mapaClima).forEach(([id, valor]) => {
            const elemento = document.getElementById(id);
            if (elemento) elemento.textContent = valor;
        });

        // 7. Atualiza tabela mensal
        atualizarTabelaMensal(dados.mensal);
    }

    // ==========================================
    // OUVINTES DE EVENTOS (LISTENERS)
    // ==========================================

    // Clique nos botões (A1, A2, B1, B2)
    botoesTalhao.forEach(botao => {
        botao.addEventListener("click", () => {
            const nomeTalhao = botao.dataset.talhao;
            if (nomeTalhao) selecionarTalhao(nomeTalhao);
        });
    });

    // Clique nas regiões desenhadas do mapa
    talhoesMapa.forEach(talhao => {
        talhao.addEventListener("click", () => {
            const nomeTalhao = talhao.dataset.talhao;
            if (nomeTalhao) selecionarTalhao(nomeTalhao);
        });
    });

    // ==========================================
    // INICIALIZAÇÃO PADRÃO
    // ==========================================
    selecionarTalhao("A1");

});