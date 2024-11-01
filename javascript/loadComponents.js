// Exemplo de loadComponents.js
async function loadComponent(id, path) {
  try {
    const response = await fetch(path);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;

    // Após carregar o header, chama a função para gerenciar a navegação
    setupNavigation();
    initializeDropdown();
  } catch (error) {
    console.error(`Failed to load component from ${path}`, error);
  }
}

// Carregar o header e o banner
Promise.all([
  loadComponent("Header", "components/Header/Header.html"),
  loadComponent("Banner", "components/Banner/Banner.html"),
  loadComponent("Footer", "components/Footer/Footer.html"),
]).then(() => {
  // Apenas inicializa o dropdown após ambos os componentes serem carregados
  initializeDropdown();
});

export function initializeDropdown() {
  // Seleciona todos os links dropdown
  const dropdownLinks = document.querySelectorAll(".dropdown-link");
  dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
          // Seleciona o menu dropdown correspondente
          const dropdownMenu = link.nextElementSibling; // Presumindo que o menu esteja imediatamente após o link
          dropdownMenu.classList.toggle("show");
      });
  });
}
 

export function setupNavigation() {
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
          const hrefValue = link.getAttribute("href");
          if (hrefValue && hrefValue.substring(1) === section.id) {
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
      const hrefValue = this.getAttribute("href");
  
      if (hrefValue) { // Verifica se hrefValue não é null
        const targetId = hrefValue.substring(1);
        const targetSection = document.getElementById(targetId);
  
        // Verifica se a seção alvo existe antes de rolar
        if (targetSection) {
          // Rolagem suave até a seção
          targetSection.scrollIntoView({ behavior: "smooth" });
  
          // Atualiza a classe active
          navLinks.forEach(link => link.classList.remove("active"));
          this.classList.add("active");
        } else {
          console.warn(`A seção com ID "${targetId}" não foi encontrada.`);
        }
      } else {
        console.warn('Atributo href não encontrado no link.');
      }
    });
  });
}

