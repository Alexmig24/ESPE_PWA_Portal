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
        ready.showNotification("Quick Jot", {
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
