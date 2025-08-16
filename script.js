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
   const diasContainer = document.getElementById("dias");
    const mesAno = document.getElementById("mesAno");
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    mesAno.textContent = `${nomesMeses[mes]} ${ano}`;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
      diasContainer.innerHTML += `<div></div>`;
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const classeHoje = (dia === hoje.getDate()) ? "hoje" : "";
      diasContainer.innerHTML += `<div class="${classeHoje}">${dia}</div>`;
    }
