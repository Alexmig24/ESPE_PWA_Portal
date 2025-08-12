let deferredPrompt;

// Evento para instalación de PWA
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Inicialización
window.addEventListener("load", async () => {
  // Solicitar permiso de notificaciones
  await Notification.requestPermission();

  // Registrar Service Worker
  if (navigator.serviceWorker) {
    const basePath = location.hostname === "localhost" ? "" : "/ESPE_PWA_Portal";
    try {
      const res = await navigator.serviceWorker.register(`${basePath}/sw.js`);
      if (res) {
        console.log("Service Worker registrado correctamente.");
        const ready = await navigator.serviceWorker.ready;
        ready.showNotification("ESPE: Portal Informativo", {
          body: "Notificaciones activadas",
          icon: "/src/assets/icons/icon-128x128.png",
          vibrate: [100, 50, 200],
        });
      }
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error);
    }
  }

  // Evento para instalar PWA
  const bannerInstall = document.querySelector("#banner-install");
  bannerInstall.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const response = await deferredPrompt.userChoice;
      if (response.outcome === "accepted") {
        console.log("El usuario aceptó la instalación");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");

  // Función para cargar páginas
  function loadPage(page) {
    fetch(`src/pages/${page}`)
      .then(res => res.text())
      .then(html => {
        contentDiv.innerHTML = html;
        componentHandler.upgradeAllRegistered(); // Recargar estilos MDL
      })
      .catch(err => {
        contentDiv.innerHTML = `<p>Error al cargar la página.</p>`;
        console.error(err);
      });
  }

  // Enlaces del menú
  document.querySelectorAll(".mdl-navigation__link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      loadPage(page);
    });
  });

  // Cargar inicio por defecto
  loadPage("inicio.html");
});
