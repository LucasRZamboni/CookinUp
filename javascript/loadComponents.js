// Cache para armazenar conteúdo dos componentes já carregados
const componentCache = {};

async function loadComponent(id, path) {
  // Verifica a existencia na cache
  if (componentCache[path]) {
    document.getElementById(id).innerHTML = componentCache[path];
    return;
  }

  try {
    const response = await fetch(path);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;

    // Armazenar em cache
    setupNavigation();
    componentCache[path] = content;
  } catch (error) {
    console.error(`Failed to load component from ${path}`, error);
  }
}

// Lista de componentes para o carregamento dinamico
const components = [
  { id: "Header", path: "components/Header/Header.html" },
  { id: "Banner", path: "components/Banner/Banner.html" },
  { id: "Footer", path: "components/Footer/Footer.html" },
];

// Loop que carrega automatico os componentes
components.forEach((component) => loadComponent(component.id, component.path));

// Função para gerenciar a navegação
function setupNavigation() {
  const navLinks = document.querySelectorAll("#nav-menu a");
  const sections = document.querySelectorAll("section");

  function setActiveLink() {
    let scrollPos = window.scrollY + 100; // Offset para melhor precisão

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").substring(1) === section.id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Listener para o evento de rolagem
  window.addEventListener("scroll", setActiveLink);

  // Listener para os cliques nos links do menu
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Previne o comportamento padrão
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Rolagem suave até a seção
      targetSection.scrollIntoView({ behavior: "smooth" });

      // Atualiza a classe active
      navLinks.forEach(link => link.classList.remove("active"));
      this.classList.add("active");
    });
  });
}