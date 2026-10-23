
/* ==========================================
   SMPIT NUR HIDAYAH
   Interaksi halaman beranda
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // MENU RESPONSIF
  const tombolMenu = document.querySelector(".tombol-menu");
  const menuNavigasi = document.querySelector(".menu-navigasi");
  const dropdown = document.querySelector(".nav-dropdown");
  const tombolDropdown = document.querySelector(".nav-dropdown-toggle");

  function tutupMenu() {
    if (!tombolMenu || !menuNavigasi) return;

    menuNavigasi.classList.remove("buka");
    tombolMenu.setAttribute("aria-expanded", "false");
    tombolMenu.setAttribute("aria-label", "Buka menu");
  }

  if (tombolMenu && menuNavigasi) {
    tombolMenu.addEventListener("click", () => {
      const sedangTerbuka = menuNavigasi.classList.toggle("buka");

      tombolMenu.setAttribute("aria-expanded", String(sedangTerbuka));
      tombolMenu.setAttribute(
        "aria-label",
        sedangTerbuka ? "Tutup menu" : "Buka menu"
      );
    });

    menuNavigasi.querySelectorAll("a").forEach((tautan) => {
      tautan.addEventListener("click", (event) => {
        // Pada layar kecil, klik Tentang Kami pertama kali
        // membuka submenu tanpa langsung menutup menu utama.
        if (
          tautan === tombolDropdown &&
          window.matchMedia("(max-width: 760px)").matches &&
          dropdown
        ) {
          event.preventDefault();
          dropdown.classList.toggle("submenu-buka");
          return;
        }

        tutupMenu();
      });
    });
  }

  // SLIDESHOW HERO
  const semuaSlide = [...document.querySelectorAll(".slide-hero")];
  const semuaTitik = [...document.querySelectorAll(".hero-titik button")];
  const tombolSebelumnya = document.querySelector(".slide-sebelumnya");
  const tombolBerikutnya = document.querySelector(".slide-berikutnya");

  let slideAktif = 0;
  let intervalSlide;

  function tampilkanSlide(indeks) {
    if (!semuaSlide.length) return;

    slideAktif = (indeks + semuaSlide.length) % semuaSlide.length;

    semuaSlide.forEach((slide, i) => {
      slide.classList.toggle("aktif", i === slideAktif);
      slide.setAttribute("aria-hidden", String(i !== slideAktif));
    });

    semuaTitik.forEach((titik, i) => {
      titik.classList.toggle("aktif", i === slideAktif);
      titik.setAttribute("aria-pressed", String(i === slideAktif));
    });
  }

  function mulaiSlideshow() {
    clearInterval(intervalSlide);

    if (semuaSlide.length > 1) {
      intervalSlide = setInterval(() => {
        tampilkanSlide(slideAktif + 1);
      }, 5000);
    }
  }

  if (semuaSlide.length) {
    tampilkanSlide(0);
    mulaiSlideshow();

    tombolSebelumnya?.addEventListener("click", () => {
      tampilkanSlide(slideAktif - 1);
      mulaiSlideshow();
    });

    tombolBerikutnya?.addEventListener("click", () => {
      tampilkanSlide(slideAktif + 1);
      mulaiSlideshow();
    });

    semuaTitik.forEach((titik, indeks) => {
      titik.addEventListener("click", () => {
        tampilkanSlide(indeks);
        mulaiSlideshow();
      });
    });

    const areaHero = document.querySelector(".hero-foto");

    areaHero?.addEventListener("mouseenter", () => {
      clearInterval(intervalSlide);
    });

    areaHero?.addEventListener("mouseleave", mulaiSlideshow);
  }

  // ANIMASI KETIKA SECTION MUNCUL
  const elemenAnimasi = document.querySelectorAll("[data-animasi]");

  if ("IntersectionObserver" in window) {
    const pengamat = new IntersectionObserver(
      (entri, observer) => {
        entri.forEach((item) => {
          if (item.isIntersecting) {
            item.target.classList.add("terlihat");
            observer.unobserve(item.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elemenAnimasi.forEach((elemen) => pengamat.observe(elemen));
  } else {
    elemenAnimasi.forEach((elemen) => {
      elemen.classList.add("terlihat");
    });
  }

  // ANIMASI ANGKA STATISTIK
  const semuaAngka = document.querySelectorAll("[data-target]");
  const angkaSudahBerjalan = new WeakSet();

  function animasikanAngka(elemen) {
    if (angkaSudahBerjalan.has(elemen)) return;
    angkaSudahBerjalan.add(elemen);

    const target = Number(elemen.dataset.target);
    const akhiran = elemen.dataset.suffix || "";
    const durasi = 1300;
    const waktuMulai = performance.now();

    function perbarui(waktuSekarang) {
      const progres = Math.min((waktuSekarang - waktuMulai) / durasi, 1);
      const halus = 1 - Math.pow(1 - progres, 3);
      const nilai = Math.round(target * halus);

      elemen.textContent = nilai.toLocaleString("id-ID") + akhiran;

      if (progres < 1) {
        requestAnimationFrame(perbarui);
      }
    }

    requestAnimationFrame(perbarui);
  }

  if ("IntersectionObserver" in window) {
    const pengamatAngka = new IntersectionObserver(
      (entri, observer) => {
        entri.forEach((item) => {
          if (item.isIntersecting) {
            animasikanAngka(item.target);
            observer.unobserve(item.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    semuaAngka.forEach((angka) => pengamatAngka.observe(angka));
  } else {
    semuaAngka.forEach(animasikanAngka);
  }

  // TOMBOL KEMBALI KE ATAS
  const tombolAtas = document.querySelector(".tombol-atas");

  function perbaruiTombolAtas() {
    tombolAtas?.classList.toggle("muncul", window.scrollY > 350);
  }

  window.addEventListener("scroll", perbaruiTombolAtas, {
    passive: true
  });

  perbaruiTombolAtas();

  tombolAtas?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // TAHUN OTOMATIS
  document.querySelectorAll("[data-tahun]").forEach((elemen) => {
    elemen.textContent = new Date().getFullYear();
  });
});


/* UPGRADE V2: aksesibilitas navigasi, tahun otomatis, tombol kembali ke atas */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-tahun]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const menuButton = document.querySelector(".tombol-menu");
  const nav = document.querySelector(".menu-navigasi");
  const dropdownButton = document.querySelector(".nav-dropdown-toggle");

  if (menuButton && nav) {
    // Sinkronkan atribut aksesibilitas dengan kelas yang digunakan menu.
    const syncMenuState = () => {
      const open = nav.classList.contains("buka") || nav.classList.contains("menu-terbuka");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-controls", nav.id || "menu-navigasi");
      menuButton.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    };
    if (!nav.id) nav.id = "menu-navigasi";

    menuButton.addEventListener("click", () => {
      // Menjaga kompatibilitas dengan halaman yang menggunakan menu-terbuka.
      window.setTimeout(syncMenuState, 0);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (link === dropdownButton && window.matchMedia("(max-width: 760px)").matches) {
          window.setTimeout(syncMenuState, 0);
          return;
        }
        if (window.matchMedia("(max-width: 760px)").matches) {
          nav.classList.remove("buka", "menu-terbuka");
          menuButton.setAttribute("aria-expanded", "false");
          menuButton.setAttribute("aria-label", "Buka menu navigasi");
        }
      });
    });
    syncMenuState();
  }

  const backTop = document.querySelector(".tombol-atas");
  if (backTop) {
    const updateBackTop = () => {
      backTop.classList.toggle("tampil", window.scrollY > 420);
      backTop.setAttribute("aria-hidden", String(window.scrollY <= 420));
    };
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", updateBackTop, { passive: true });
    updateBackTop();
  }
});
