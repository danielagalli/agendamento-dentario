const USER = "dentista";
const PASS = "sorriso123";

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

function doLogin() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === USER && p === PASS) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("agendaSection").style.display = "block";
    renderAppointments();
    gerarCalendarioMensal();
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

function doLogout() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("agendaSection").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function addAppointment() {
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const nome = document.getElementById("nome").value;

  if (!name || !date || !time) {
    alert("Preencha todos os campos!");
    return;
  }

  appointments.push({ name, date, time });
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
  gerarCalendarioMensal();

  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
}

function renderAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";

  appointments.forEach((app, index) => {
    const li = document.createElement("li");
    li.textContent = `${app.name} - ${app.date} às ${app.time}`;

    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.onclick = () => {
      appointments.splice(index, 1);
      localStorage.setItem("appointments", JSON.stringify(appointments));
      renderAppointments();
      gerarCalendarioMensal();
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

function gerarCalendarioMensal(mes = new Date().getMonth(), ano = new Date().getFullYear()) {
  const calendario = document.getElementById("calendarioMensal");
  calendario.innerHTML = "";

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay();

  const nomeMes = new Date(ano, mes).toLocaleString("pt-BR", { month: "long" });
  let html = `<h3>${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} ${ano}</h3>`;
  html += "<table class='calendario'><thead><tr>";
  diasSemana.forEach(dia => html += `<th>${dia}</th>`);
  html += "</tr></thead><tbody><tr>";

  for (let i = 0; i < primeiroDia; i++) html += "<td></td>";

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const temAgendamento = appointments.some(app => app.date === dataStr);

    html += `<td onclick="listarHorarios('${dataStr}')" style="background-color:${temAgendamento ? '#ffcdd2' : '#c8e6c9'}">${dia}</td>`;
    if ((primeiroDia + dia) % 7 === 0) html += "</tr><tr>";
  }

  html += "</tr></tbody></table>";
  calendario.innerHTML = html;
}

function listarHorarios(data) {
  const horariosFixos = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
  const agendados = appointments.filter(app => app.date === data).map(app => app.time);

  const lista = horariosFixos.map(horario => {
    const ocupado = agendados.includes(horario);
    return `<li style="color:${ocupado ? 'red' : 'green'}">${horario} - ${ocupado ? "Indisponível" : "Disponível"}</li>`;
  }).join("");

  document.getElementById("horariosDoDia").innerHTML = `<h4>Horários para ${data}</h4><ul>${lista}</ul>`;
}

let slideAtual = 0;
let slides = [];
let indicadores = [];

function mostrarSlide(indice) {
  slideAtual = indice;
  slides.forEach((slide, i) => {
    slide.style.display = i === slideAtual ? 'block' : 'none';
  });
  indicadores.forEach((indicador, i) => {
    indicador.classList.toggle('ativo', i === slideAtual);
  });
}

function mudarSlide(direcao) {
  slideAtual = (slideAtual + direcao + slides.length) % slides.length;
  mostrarSlide(slideAtual);
}

document.addEventListener('DOMContentLoaded', () => {
  slides = document.querySelectorAll('.carrossel-slide');
  indicadores = document.querySelectorAll('.indicador');
  mostrarSlide(slideAtual);

  // ⏱️ Rotação automática a cada 5 segundos
  setInterval(() => {
    mudarSlide(1);
  }, 5000);

  // Torna as funções acessíveis globalmente
  window.mudarSlide = mudarSlide;
  window.mostrarSlide = mostrarSlide;
});




function gerarPDF() {
  const area = document.getElementById("appointmentList");
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  html2canvas(area).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    pdf.text("Agenda de Pacientes - Semana Atual", 10, 10);
    pdf.addImage(imgData, 'PNG', 10, 20, 180, 0); // ajusta conforme tamanho

    pdf.save(`agenda-${dataAtual}.pdf`);
  });
}

document.querySelector(".login-topo").style.display = "none";

  function mostrarCalendario() {
    const calendario = document.getElementById('calendario-container');
    calendario.style.display = 'block';
  }
  function mostrarAgendamento() {
    document.getElementById('agendamento-container').style.display = 'block';
  }

  function mostrarHorariosDisponiveis() {
    const horarios = [
      "08:00", "09:00", "10:30", "13:00", "14:30", "16:00"
    ];

    const select = document.getElementById('horario-consulta');
    select.innerHTML = ""; // Limpa opções anteriores

    horarios.forEach(horario => {
      const option = document.createElement("option");
      option.value = horario;
      option.textContent = horario;
      select.appendChild(option);
    });

    document.getElementById('horarios-container').style.display = 'block';
  }    
    const horariosFixos = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00"
];

let agendamentos = JSON.parse(localStorage.getItem("appointments")) || [];

function mostrarHorarios() {
  const data = document.getElementById("dataEscolhida").value;
  const container = document.getElementById("horariosDisponiveis");

  if (!data) {
    container.innerHTML = "";
    return;
  }

  const ocupados = agendamentos
    .filter(app => app.date === data)
    .map(app => app.time);

  const lista = horariosFixos.map(horario => {
    const ocupado = ocupados.includes(horario);
    return `<div class="horario ${ocupado ? 'indisponivel' : 'disponivel'}">
              ${horario} - ${ocupado ? "Indisponível" : "Disponível"}
            </div>`;
  }).join("");

  container.innerHTML = `<h2>Horários para ${formatarData(data)}</h2>${lista}`;
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

    let dataSelecionada = "";
    let horarioSelecionado = "";

    function mostrarHorarios() {
      const data = document.getElementById("dataEscolhida").value;
      const container = document.getElementById("horariosDisponiveis");
      document.getElementById("formAgendamento").style.display = "none";
      dataSelecionada = data;

      if (!data) {
        container.innerHTML = "";
        return;
      }

      const ocupados = agendamentos
        .filter(app => app.date === data)
        .map(app => app.time);

      const listaHorarios = horariosFixos.map(horario => {
        const ocupado = ocupados.includes(horario);
        return `
          <div class="horario ${ocupado ? 'indisponivel' : 'disponivel'}"
               onclick="${ocupado ? '' : `selecionarHorario('${horario}')`}">
            ${horario} - ${ocupado ? "Indisponível" : "Disponível"}
          </div>`;
      }).join("");

      container.innerHTML = `
        <h2>Horários para ${formatarData(data)}</h2>
        ${listaHorarios}
      `;
    }

    function selecionarHorario(horario) {
      horarioSelecionado = horario;
      document.getElementById("formAgendamento").style.display = "block";
      document.getElementById("resumoEscolha").textContent =
        `Data: ${formatarData(dataSelecionada)} | Horário: ${horarioSelecionado}`;
    }

    function confirmarAgendamento() {
      const nome = document.getElementById("nomePaciente").value.trim();

      if (!nome) {
        alert("Por favor, digite seu nome.");
        return;
      }

      agendamentos.push({
        name: nome,
        date: dataSelecionada,
        time: horarioSelecionado
      });

      localStorage.setItem("appointments", JSON.stringify(agendamentos));
      alert("Agendamento confirmado com sucesso!");

      // Resetar
      document.getElementById("formAgendamento").style.display = "none";
      document.getElementById("nomePaciente").value = "";
      mostrarHorarios();
    }

    function formatarData(dataISO) {
      const [ano, mes, dia] = dataISO.split("-");
      return `${dia}/${mes}/${ano}`;
    }
  /**AGENDAMENTO*/
  const calendario = document.getElementById("calendario");
  const containerHorarios = document.getElementById("horariosDisponiveis");
  const resumo = document.getElementById("resumoEscolha");

  let dataSelecionada = "";
  let horarioSelecionado = "";

  const horariosFixos = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
  let agendamentos = JSON.parse(localStorage.getItem("appointments")) || [];

  function gerarCalendario(mes, ano) {
    calendario.innerHTML = "";
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    diasSemana.forEach(dia => {
      const header = document.createElement("div");
      header.textContent = dia;
      header.style.fontWeight = "bold";
      calendario.appendChild(header);
    });

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
      const vazio = document.createElement("div");
      calendario.appendChild(vazio);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const celula = document.createElement("div");
      celula.className = "dia";
      celula.textContent = dia;
      celula.onclick = () => selecionarDia(dia, mes, ano, celula);
      calendario.appendChild(celula);
    }
  }

  function selecionarDia(dia, mes, ano, celula) {
    document.querySelectorAll(".dia").forEach(d => d.classList.remove("selecionado"));
    celula.classList.add("selecionado");

    const data = new Date(ano, mes, dia);
    dataSelecionada = data.toISOString().split("T")[0]; // formato YYYY-MM-DD
    mostrarHorarios();
  }

  function mostrarHorarios() {
    document.getElementById("formAgendamento").style.display = "none";
    horarioSelecionado = "";

    const ocupados = agendamentos
      .filter(app => app.date === dataSelecionada)
      .map(app => app.time);

    const listaHorarios = horariosFixos.map(horario => {
      const ocupado = ocupados.includes(horario);
      return `
        <div class="horario ${ocupado ? 'indisponivel' : 'disponivel'}"
             onclick="${ocupado ? '' : `selecionarHorario('${horario}')`}">
          ${horario} - ${ocupado ? "Indisponível" : "Disponível"}
        </div>`;
    }).join("");

    containerHorarios.innerHTML = `
      <h2>Horários para ${formatarData(dataSelecionada)}</h2>
      ${listaHorarios}
    `;
  }

  function selecionarHorario(horario) {
    horarioSelecionado = horario;
    document.getElementById("formAgendamento").style.display = "block";
    resumo.textContent = `Data: ${formatarData(dataSelecionada)} | Horário: ${horarioSelecionado}`;
  }

  function confirmarAgendamento() {
    const nome = document.getElementById("nomePaciente").value.trim();
    if (!nome) {
      alert("Por favor, digite seu nome.");
      return;
    }

    agendamentos.push({
      name: nome,
      date: dataSelecionada,
      time: horarioSelecionado
    });

    localStorage.setItem("appointments", JSON.stringify(agendamentos));
    alert("Agendamento confirmado com sucesso!");

    document.getElementById("formAgendamento").style.display = "none";
    document.getElementById("nomePaciente").value = "";
    mostrarHorarios();
  }

  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // Inicialização
  const hoje = new Date();
  gerarCalendario(hoje.getMonth(), hoje.getFullYear());
</script>



