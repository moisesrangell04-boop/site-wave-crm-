// WAVE CRM — Institutional Website JS

// ⬇️ COLE AQUI a URL do Google Apps Script (veja google-apps-script.js para instruções)
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwPs_81P6OfdATwQcCMIuc4OiVvvF_Rm3xcnHAwLMGrQde-SofMiTcWz_Sm07zbViTw/exec';

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  navbar.classList.add('scrolled');
  const onScroll = () => {
    navbar.classList.toggle('shadow', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Hamburger menu ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Smooth scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Reveal on scroll ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Stagger delay for grid cards ---
  document.querySelectorAll('.diferenciais-grid, .steps-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // =============================================
  // LEAD FORM MODAL
  // =============================================
  const modal = document.getElementById('leadModal');
  const openBtn = document.getElementById('openLeadForm');
  const closeBtn = document.getElementById('closeLeadModal');
  const leadForm = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');

  if (openBtn && modal) {
    // Open modal function
    const openModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Reset form state
      leadForm.style.display = '';
      formSuccess.classList.remove('show');
      leadForm.reset();
      // Mark as shown in session storage
      sessionStorage.setItem('wave_popup_shown', 'true');
    };

    // Manual trigger
    openBtn.addEventListener('click', openModal);

    // Auto-popup on scroll
    let scrollTimerTriggered = false;
    window.addEventListener('scroll', () => {
      if (!scrollTimerTriggered && window.scrollY > 50) {
        scrollTimerTriggered = true;
        // Only trigger if not shown before in this session
        if (!sessionStorage.getItem('wave_popup_shown')) {
          setTimeout(() => {
            // Check again if shown or already open
            if (!sessionStorage.getItem('wave_popup_shown') && !modal.classList.contains('open')) {
              openModal();
            }
          }, 3000);
        }
      }
    }, { passive: true });

    // Close modal
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Phone mask: (XX) XXXXX-XXXX
    const phoneInput = document.getElementById('leadTelefone');
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      phoneInput.value = v;
    });

    // Submit form → send to Google Sheets
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      const lead = {
        nome: document.getElementById('leadNome').value.trim(),
        email: document.getElementById('leadEmail').value.trim(),
        telefone: document.getElementById('leadTelefone').value.trim(),
        nicho: document.getElementById('leadNicho').value.trim(),
        faturamento: document.getElementById('leadFaturamento').value,
        data: new Date().toLocaleString('pt-BR'),
      };

      // Save to localStorage as backup
      const leads = JSON.parse(localStorage.getItem('wave_leads') || '[]');
      leads.push(lead);
      localStorage.setItem('wave_leads', JSON.stringify(leads));

      // Send to Google Sheets via hidden form (bypasses CORS)
      if (GOOGLE_SHEET_URL) {
        try {
          // Create hidden iframe
          let iframe = document.getElementById('_leadIframe');
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = '_leadIframe';
            iframe.name = '_leadIframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }

          // Create hidden form
          const hiddenForm = document.createElement('form');
          hiddenForm.method = 'POST';
          hiddenForm.action = GOOGLE_SHEET_URL;
          hiddenForm.target = '_leadIframe';
          hiddenForm.style.display = 'none';

          // Add fields
          Object.entries(lead).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            hiddenForm.appendChild(input);
          });

          document.body.appendChild(hiddenForm);
          hiddenForm.submit();
          document.body.removeChild(hiddenForm);
        } catch (err) {
          console.warn('Falha ao enviar para Google Sheets (salvo localmente):', err);
        }
      }

      // Show success
      leadForm.style.display = 'none';
      formSuccess.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';

      // Show export FAB
      updateExportFab();

      // Auto-close after 3s
      setTimeout(closeModal, 3000);
    });
  }

  // =============================================
  // EXPORT LEADS TO EXCEL (CSV)
  // =============================================
  const exportBtn = document.getElementById('exportLeads');

  function updateExportFab() {
    if (!exportBtn) return;
    const leads = JSON.parse(localStorage.getItem('wave_leads') || '[]');
    exportBtn.style.display = leads.length > 0 ? 'flex' : 'none';
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const leads = JSON.parse(localStorage.getItem('wave_leads') || '[]');
      if (leads.length === 0) return;

      // BOM for Excel UTF-8 recognition
      const BOM = '\uFEFF';
      const header = 'Nome;Email;Telefone;Nicho;Faturamento;Data\n';
      const rows = leads.map(l =>
        `${l.nome};${l.email};${l.telefone};${l.nicho};${l.faturamento};${l.data}`
      ).join('\n');

      const csv = BOM + header + rows;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-wave-crm-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Show export FAB if there are leads
    updateExportFab();
  }

});
