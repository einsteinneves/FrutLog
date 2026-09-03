/* ============================================================================
   VitiLog — login.js
   Responsável: Hillce  (JavaScript / Funcionalidades)

   Faz: validação do formulário, autenticação, criação da sessão e o bloqueio
   de atalhos de navegação exigido pelo plano de testes do QA.

   INTEGRAÇÃO: com USAR_DADOS_SIMULADOS = true a autenticação usa a lista
   USUARIOS_SIMULADOS abaixo. Quando o Arthur entregar o endpoint POST /login,
   troque para false e confira API_BASE.
============================================================================ */

const USAR_DADOS_SIMULADOS = true;
const API_BASE = "http://localhost:3000/api";

/* PROVISÓRIO: substituir pela tabela de usuários do banco (Arthur).
   Os três perfis vêm da especificação da Bianca (UI/UX).                      */
const USUARIOS_SIMULADOS = [
    { matricula: "1001", senha: "gerente123",  nome: "Ana Ribeiro",   perfil: "gerente",  perfilRotulo: "Gerente Agrícola" },
    { matricula: "2001", senha: "agronomo123", nome: "Carlos Menezes", perfil: "agronomo", perfilRotulo: "Agrônomo" },
    { matricula: "3001", senha: "tecnico123",  nome: "Marina Alves",  perfil: "tecnico",  perfilRotulo: "Técnico Agrícola" }
];


document.addEventListener("DOMContentLoaded", function () {

    const formulario    = document.querySelector("form");
    const campoUsuario  = document.getElementById("username");
    const campoSenha    = document.getElementById("password");
    const olhoSenha     = document.getElementById("togglePassword");

    /* ---------------------------------------------------------------
       Mostrar / esconder a senha
    --------------------------------------------------------------- */
    if (olhoSenha) {
        olhoSenha.addEventListener("click", function () {
            const escondida = campoSenha.type === "password";

            campoSenha.type = escondida ? "text" : "password";
            olhoSenha.classList.toggle("fa-eye", !escondida);
            olhoSenha.classList.toggle("fa-eye-slash", escondida);
        });
    }


    /* ---------------------------------------------------------------
       Envio do formulário
    --------------------------------------------------------------- */
    formulario.addEventListener("submit", async function (evento) {

        /* O back-end ainda não existe; o envio é tratado aqui no JS. */
        evento.preventDefault();
        limparMensagem();

        const matricula = campoUsuario.value.trim();
        const senha     = campoSenha.value;

        /* Validações de formulário — item 3 do plano de testes do Guilherme. */
        if (matricula === "") {
            return mostrarErro("Informe a sua matrícula.", campoUsuario);
        }

        if (!/^[0-9]+$/.test(matricula)) {
            return mostrarErro("A matrícula deve conter apenas números.", campoUsuario);
        }

        if (senha.length < 8) {
            return mostrarErro("A senha deve conter pelo menos 8 caracteres.", campoSenha);
        }

        try {
            const usuario = await autenticar(matricula, senha);

            if (!usuario) {
                return mostrarErro("Matrícula ou senha inválida.", campoSenha);
            }

            /* Sessão do navegador: some quando a aba é fechada. */
            sessionStorage.setItem("vitilog_sessao", JSON.stringify({
                matricula: usuario.matricula,
                nome: usuario.nome,
                perfil: usuario.perfil,
                perfilRotulo: usuario.perfilRotulo,
                entradaEm: new Date().toISOString()
            }));

            /* replace() evita voltar para o login pelo botão Voltar. */
            window.location.replace("index.html");

        } catch (erro) {
            mostrarErro("Não foi possível conectar ao servidor. Tente novamente.", campoUsuario);
        }
    });


    /* ---------------------------------------------------------------
       Bloqueia Alt + Setas (evita sair/voltar na página)
    --------------------------------------------------------------- */
    window.addEventListener("keydown", function (evento) {
        if (evento.altKey && (evento.key === "ArrowLeft" || evento.key === "ArrowRight")) {
            evento.preventDefault();
            console.log("Navegação por atalho bloqueada por segurança.");
        }
    });


    /* ---------------------------------------------------------------
       Aviso de ambiente de teste (some quando a API real entrar)
    --------------------------------------------------------------- */
    if (USAR_DADOS_SIMULADOS) {
        const aviso = document.createElement("p");
        aviso.className = "aviso-teste";
        aviso.textContent =
            "Ambiente de demonstração · 1001 / gerente123 · 2001 / agronomo123 · 3001 / tecnico123";
        formulario.appendChild(aviso);
    }


    /* =============================================================
       Funções auxiliares
    ============================================================= */

    async function autenticar(matricula, senha) {
        if (USAR_DADOS_SIMULADOS) {
            return USUARIOS_SIMULADOS.find(function (usuario) {
                return usuario.matricula === matricula && usuario.senha === senha;
            }) || null;
        }

        const resposta = await fetch(API_BASE + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matricula: matricula, senha: senha })
        });

        if (resposta.status === 401) return null;
        if (!resposta.ok) throw new Error("Servidor respondeu " + resposta.status);

        return await resposta.json();
    }

    /* Usa textContent (nunca innerHTML) para não abrir brecha de XSS. */
    function mostrarErro(texto, campo) {
        let caixa = document.querySelector(".mensagem-erro");

        if (!caixa) {
            caixa = document.createElement("p");
            caixa.className = "mensagem-erro";
            caixa.setAttribute("role", "alert");
            formulario.insertBefore(caixa, formulario.firstChild);
        }

        caixa.textContent = texto;

        if (campo) campo.focus();
    }

    function limparMensagem() {
        const caixa = document.querySelector(".mensagem-erro");
        if (caixa) caixa.remove();
    }
});
