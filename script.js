const defaultProjects = [
  {
    name: "سفر به شمال",
    phone: "09032574495",
    date: "1403/03/12",
    status: "در حال ادیت",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    duration: "02:45",
    star: true
  },
  {
    name: "غروب تهران",
    phone: "09123456789",
    date: "1403/03/08",
    status: "تکمیل شده",
    img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=700&q=80",
    duration: "01:58",
    star: false
  },
  {
    name: "جاده چالوس",
    phone: "09351234567",
    date: "1403/02/28",
    status: "در حال ادیت",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80",
    duration: "03:20",
    star: false
  },
  {
    name: "دریای کیش",
    phone: "09121234567",
    date: "1403/02/20",
    status: "تکمیل شده",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
    duration: "01:12",
    star: false
  },
  {
    name: "طبیعت ابر و باد",
    phone: "09011112222",
    date: "1403/02/15",
    status: "خام",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
    duration: "02:10",
    star: false
  }
];

let projects =
  JSON.parse(localStorage.getItem("editProjects")) ||
  defaultProjects;

let activeFilter = "همه";


/* =====================================
   تبدیل اعداد انگلیسی به فارسی
===================================== */

function faDigits(value) {
  return String(value).replace(
    /\d/g,
    digit => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}


/* =====================================
   نمایش پروژه‌ها
===================================== */

function render() {

  const projectsContainer =
    document.getElementById("projects");

  const empty =
    document.getElementById("empty");

  const count =
    document.getElementById("count");

  const searchInput =
    document.getElementById("search");

  if (!projectsContainer) return;


  const query =
    searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";


  const filteredProjects =
    projects.filter(project => {

      const filterMatch =
        activeFilter === "همه" ||
        project.status === activeFilter;


      const searchMatch =
        project.name
          .toLowerCase()
          .includes(query) ||

        project.phone
          .includes(query);


      return filterMatch && searchMatch;
    });


  count.textContent =
    faDigits(filteredProjects.length) +
    " پروژه";


  if (filteredProjects.length === 0) {

    projectsContainer.innerHTML = "";

    empty.style.display = "block";

    return;
  }


  empty.style.display = "none";


  projectsContainer.innerHTML =
    filteredProjects.map(project => {

      const realIndex =
        projects.indexOf(project);


      let statusClass = "";

      if (project.status === "تکمیل شده") {
        statusClass = "done";
      }

      if (project.status === "خام") {
        statusClass = "raw";
      }


      return `

        <article class="card">

          <div
            class="thumb"
            style="
              background-image:
              url('${escapeHtml(project.img)}')
            "
          >

            <span class="duration">
              ${escapeHtml(project.duration || "—")}
            </span>

          </div>


          <div class="info">

            <div class="project-head">

              <span class="project-name">
                ${escapeHtml(project.name)}
              </span>


              <span
                class="star ${project.star ? "on" : ""}"
                onclick="toggleStar(${realIndex})"
              >
                ${project.star ? "★" : "☆"}
              </span>

            </div>


            <div class="meta">

              <span>
                📞 ${escapeHtml(project.phone)}
              </span>

              <span>
                📅 ${escapeHtml(project.date)}
              </span>

            </div>


            <span
              class="status ${statusClass}"
            >
              وضعیت: ${escapeHtml(project.status)}
            </span>

          </div>


          <span
            class="menu"
            onclick="projectMenu(${realIndex})"
          >
            ⋮
          </span>

        </article>

      `;

    }).join("");
}


/* =====================================
   جلوگیری از HTML Injection
===================================== */

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => {

      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    }
  );
}


/* =====================================
   فیلتر پروژه‌ها
===================================== */

function setFilter(filter, button) {

  activeFilter = filter;


  document
    .querySelectorAll(".filter")
    .forEach(item => {

      item.classList.remove("active");

    });


  if (button) {
    button.classList.add("active");
  }


  render();
}


/* =====================================
   باز کردن پنجره پروژه جدید
===================================== */

function openModal() {

  const modal =
    document.getElementById("modal");

  modal.classList.add("show");


  setTimeout(() => {

    document
      .getElementById("name")
      ?.focus();

  }, 100);
}


/* =====================================
   بستن پنجره
===================================== */

function closeModal() {

  const modal =
    document.getElementById("modal");

  modal.classList.remove("show");
}


/* =====================================
   افزودن پروژه
===================================== */

function addProject() {

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const date =
    document.getElementById("date").value;

  const status =
    document.getElementById("status").value;


  if (!name) {

    alert("لطفاً نام پروژه را وارد کنید.");

    return;
  }


  if (!phone) {

    alert("لطفاً شماره تماس را وارد کنید.");

    return;
  }


  const newProject = {

    name: name,

    phone: phone,

    date: date
      ? formatDate(date)
      : "بدون تاریخ",

    status: status,

    img:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80",

    duration: "—",

    star: false
  };


  projects.unshift(newProject);


  saveProjects();


  document.getElementById("name").value = "";

  document.getElementById("phone").value = "";

  document.getElementById("date").value = "";

  document.getElementById("status").value =
    "در حال ادیت";


  closeModal();

  render();
}


/* =====================================
   تبدیل تاریخ
===================================== */

function formatDate(dateString) {

  const date =
    new Date(dateString);


  if (Number.isNaN(date.getTime())) {
    return "بدون تاریخ";
  }


  const day =
    String(date.getDate()).padStart(2, "0");

  const month =
    String(date.getMonth() + 1).padStart(2, "0");

  const year =
    date.getFullYear();


  return `${year}/${month}/${day}`;
}


/* =====================================
   علاقه‌مندی
===================================== */

function toggleStar(index) {

  if (!projects[index]) return;


  projects[index].star =
    !projects[index].star;


  saveProjects();

  render();
}


/* =====================================
   منوی پروژه
===================================== */

function projectMenu(index) {

  if (!projects[index]) return;


  const choice =
    prompt(
      "شماره گزینه را وارد کنید:\n\n" +
      "1 - حذف پروژه\n" +
      "2 - تغییر وضعیت\n" +
      "3 - لغو"
    );


  if (choice === "1") {

    deleteProject(index);

  }

  else if (choice === "2") {

    changeStatus(index);

  }
}


/* =====================================
   حذف پروژه
===================================== */

function deleteProject(index) {

  if (!projects[index]) return;


  const confirmed =
    confirm(
      `پروژه «${projects[index].name}» حذف شود؟`
    );


  if (!confirmed) return;


  projects.splice(index, 1);


  saveProjects();

  render();
}


/* =====================================
   تغییر وضعیت
===================================== */

function changeStatus(index) {

  const statuses = [
    "خام",
    "در حال ادیت",
    "تکمیل شده",
    "آرشیو"
  ];


  const current =
    projects[index].status;


  const currentIndex =
    statuses.indexOf(current);


  const nextIndex =
    (currentIndex + 1) % statuses.length;


  projects[index].status =
    statuses[nextIndex];


  saveProjects();

  render();
}


/* =====================================
   ذخیره اطلاعات
===================================== */

function saveProjects() {

  localStorage.setItem(
    "editProjects",
    JSON.stringify(projects)
  );
}


/* =====================================
   کلیک بیرون از پنجره
===================================== */

document
  .getElementById("modal")
  ?.addEventListener(
    "click",
    function(event) {

      if (event.target === this) {

        closeModal();

      }

    }
  );


/* =====================================
   کلید ESC
===================================== */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {

      closeModal();

    }

  }
);


/* =====================================
   شروع برنامه
===================================== */

render();
