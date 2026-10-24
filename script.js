
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
/* ==========================================
   HALAMAN PRESTASI — SMPIT NUR HIDAYAH
   Filter kategori dan interaksi kartu
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const bagianPrestasi = document.querySelector(".halaman-prestasi");

  // Jalankan hanya jika halaman Prestasi sedang dibuka.
  if (!bagianPrestasi) return;

  const tombolFilter = bagianPrestasi.querySelectorAll(
    ".prestasi-filter-btn"
  );

  const semuaKartu = bagianPrestasi.querySelectorAll(
    ".prestasi-kartu"
  );

  const teksHasil = bagianPrestasi.querySelector(
    ".prestasi-hasil-filter"
  );

  const pesanKosong = bagianPrestasi.querySelector(
    ".prestasi-kosong"
  );

  function saringPrestasi(kategori) {
    let jumlahTampil = 0;

    semuaKartu.forEach((kartu) => {
      const kategoriKartu = kartu.dataset.kategori;
      const cocok =
        kategori === "semua" || kategoriKartu === kategori;

      kartu.hidden = !cocok;
      kartu.classList.remove("filter-masuk");

      if (cocok) {
        jumlahTampil++;

        // Memicu ulang animasi saat kartu ditampilkan.
        void kartu.offsetWidth;
        kartu.classList.add("filter-masuk");
      }
    });

    // Perbarui informasi hasil filter.
    const tombolAktif = [...tombolFilter].find(
      (tombol) => tombol.dataset.filter === kategori
    );

    const namaKategori = tombolAktif
      ? tombolAktif.textContent.trim()
      : "Semua Cerita";

    if (teksHasil) {
      teksHasil.textContent =
        kategori === "semua"
          ? `Menampilkan semua ${jumlahTampil} cerita prestasi.`
          : `Menampilkan ${jumlahTampil} cerita dalam kategori ${namaKategori}.`;
    }

    // Tampilkan pesan jika tidak ada kartu yang cocok.
    if (pesanKosong) {
      pesanKosong.hidden = jumlahTampil !== 0;
    }
  }

  tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", () => {
      const kategori = tombol.dataset.filter;

      tombolFilter.forEach((item) => {
        const aktif = item === tombol;

        item.classList.toggle("aktif", aktif);
        item.setAttribute("aria-pressed", String(aktif));
      });

      saringPrestasi(kategori);
    });
  });

  // Kondisi awal: tampilkan semua prestasi.
  saringPrestasi("semua");
});