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

   
    /**Agendamento*/

