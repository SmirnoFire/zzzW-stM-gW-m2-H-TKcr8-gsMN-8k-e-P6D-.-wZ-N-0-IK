const content = document.getElementById("content");
const tabs = document.querySelectorAll(".tabs button");
// Προσθήκη κλάσης fade στο welcome
const welcome = document.getElementById("welcome");
if (welcome) {
  welcome.classList.add("fade");
  // Μικρό delay για να εφαρμοστεί το show
  setTimeout(() => welcome.classList.add("show"), 10);
}

// ------------------
// Αποθήκευση δεδομένων
// ------------------
let tabData = { 0: [], 1: [], 2: [], 3: [] };
const savedData = localStorage.getItem("tabData");
if (savedData) tabData = JSON.parse(savedData);
function saveData() {
  localStorage.setItem("tabData", JSON.stringify(tabData));
}

// ------------------
// Κουμπί επαναφοράς tabs (μόνο για Αφίσες)
// ------------------
let showTabsBtn = document.getElementById("showTabsBtn");
if (!showTabsBtn) {
  showTabsBtn = document.createElement("button");
  showTabsBtn.id = "showTabsBtn";
  showTabsBtn.textContent = "🔄"; // εικονίδιο επαναφοράς
  Object.assign(showTabsBtn.style, {
    position: "fixed",
    top: "20px",
    right: "70px", // μετακινημένο αριστερά από το 🏠
    padding: "8px",
    borderRadius: "50%", // στρογγυλό
    border: "none",
    background: "#2563eb", // μπλε όπως το 🏠
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    display: "none",
    zIndex: 200,
  });
  document.body.appendChild(showTabsBtn);
}

const tabsContainer = document.querySelector(".tabs");
function hideTabs() {
  tabsContainer.style.transform = "translateY(100%)";
  // Εμφάνιση κουμπιού μόνο στην καρτέλα Αφίσες
  if (
    tabsContainer.querySelector("button.active")?.textContent.includes("Αφίσες")
  ) {
    showTabsBtn.style.display = "block";
  }
}
function showTabs() {
  tabsContainer.style.transform = "translateY(0)";
  showTabsBtn.style.display = "none";
}
showTabsBtn.addEventListener("click", () => showTabs());

content.addEventListener("scroll", () => {
  const activeTabIndex = Array.from(tabs).findIndex((btn) =>
    btn.classList.contains("active")
  );
  if (activeTabIndex === 3) {
    // Αφίσες
    const scrollTop = content.scrollTop;

    if (!tabsHidden && scrollTop > 10) {
      hideTabs();
      tabsHidden = true;
    }
    // δεν εμφανίζονται αυτόματα τα tabs όταν κάνεις scroll προς τα πάνω
  }
});

function hideTabs() {
  tabsContainer.style.transform = "translateY(100%)";
  showTabsBtn.style.display = "block"; // εμφανίζεται μόνο όταν κρύψεις τα tabs
}

// ------------------
// Κουμπί showTabsBtn
// ------------------
showTabsBtn.addEventListener("click", () => {
  showTabs();
  tabsHidden = false; // τώρα τα tabs είναι ορατά
});

// ------------------
// Εμφάνιση καρτέλας
// ------------------
function showTab(index) {
  tabs.forEach((btn, i) => btn.classList.toggle("active", i === index));

  // Όταν ΔΕΝ είναι καρτέλα Αφίσες → το κουμπί να εξαφανίζεται πάντα
  if (index !== 3) {
    showTabsBtn.style.display = "none";
  }

  // ... (παραμένει ο υπόλοιπος κώδικας όπως είναι)
}

// ------------------
// Welcome
// ------------------
function closeWelcome() {
  const welcome = document.getElementById("welcome");
  if (!welcome) return;

  // fade out
  welcome.classList.remove("show");
  setTimeout(() => {
    welcome.style.display = "none";
  }, 500);

  // fade in Home button
  homeBtn.style.display = "block";
  homeBtn.classList.add("fade");
  setTimeout(() => homeBtn.classList.add("show"), 10);

  showTab(0);
}

const continueBtn = document.querySelector("#welcome button");
if (continueBtn) continueBtn.addEventListener("click", closeWelcome);

// ------------------
// Δημιουργία λίστας στοιχείων
// ------------------
function createListItem(text, onDelete, onEdit) {
  const li = document.createElement("li");

  li.style.display = "flex";
  li.style.alignItems = "center";
  li.style.justifyContent = "space-between";
  li.style.background = "#1f1f1f";
  li.style.marginBottom = "6px";
  li.style.padding = "6px 10px";
  li.style.borderRadius = "6px";
  li.style.fontSize = "16px";
  li.style.color = "#fff";

  const span = document.createElement("span");
  span.innerHTML = text;
  span.style.flex = "1";

  // container για κουμπιά
  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "6px";

  // ✏️ edit
  const editBtn = document.createElement("button");
  editBtn.textContent = "🖊️";
  editBtn.style.background = "none";
  editBtn.style.border = "none";
  editBtn.style.cursor = "pointer";
  editBtn.style.fontSize = "16px";
  editBtn.style.color = "#fff";
  editBtn.addEventListener("mouseover", () => (editBtn.style.color = "orange"));
  editBtn.addEventListener("mouseout", () => (editBtn.style.color = "#fff"));
  editBtn.addEventListener("click", () => {
    if (onEdit) onEdit(span);
  });

  // 🗑️ delete
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.style.background = "none";
  delBtn.style.border = "none";
  delBtn.style.cursor = "pointer";
  delBtn.style.fontSize = "16px";
  delBtn.style.color = "#fff";
  delBtn.addEventListener("mouseover", () => (delBtn.style.color = "#ff3333"));
  delBtn.addEventListener("mouseout", () => (delBtn.style.color = "#fff"));
  delBtn.addEventListener("click", onDelete);

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(btnContainer);

  return li;
}

// ------------------
// Έλεγχος μεγάλων λιστών
// ------------------
function checkTabsVisibility() {
  const activeTabIndex = Array.from(tabs).findIndex((btn) =>
    btn.classList.contains("active")
  );

  let listLength = 0;
  let listContainer;

  if (activeTabIndex === 0) listContainer = document.getElementById("pairList");
  else if (activeTabIndex === 1 || activeTabIndex === 2)
    listContainer = document.getElementById("nameList");
  else return; // για tab Αφίσες δεν το κάνουμε εδώ

  if (!listContainer) return;

  listLength = listContainer.children.length;

  if (listLength > 16) {
    // κρύβουμε τα tabs με animation όπως στα Αφίσες
    tabsContainer.style.transform = "translateY(100%)";
    showTabsBtn.style.display = "block";

    // Επιπλέον μπορούμε να περιορίσουμε το ύψος του container
    listContainer.style.maxHeight = "calc(100vh - 60px)"; // προσαρμόζεις ανάλογα
    listContainer.style.overflowY = "auto";
  } else {
    tabsContainer.style.transform = "translateY(0)";
    showTabsBtn.style.display = "none";
    listContainer.style.maxHeight = "";
    listContainer.style.overflowY = "";
  }
}

// ------------------
// Εμφάνιση καρτέλας
// ------------------
function showTab(index) {
  tabs.forEach((btn, i) => btn.classList.toggle("active", i === index));

  // --- Παραγγελίες
  if (index === 0) {
    content.innerHTML = `
    <p style="font-size:20px;font-family:'Comic Sans MS';font-weight:bold;">Διάλεξε όνομα και έντυπο:</p>
    
    <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center;">
      <select id="nameSelect"><option value="">-- Επιλογή ονόματος --</option></select>
      <select id="formSelect"><option value="">-- Επιλογή εντύπου --</option></select>
    </div>

    <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
  <button id="addBtn" style="font-family:'Comic Sans MS'; font-size:16px; font-weight:bold; padding:6px 10px; border-radius:6px; border:none; cursor:pointer; background:#2563eb; color:#fff;">Προσθήκη</button>
  <button id="totalsBtn" style="font-family:'Comic Sans MS'; font-size:16px; font-weight:bold; padding:6px 10px; border-radius:6px; border:none; cursor:pointer; background:#2563eb; color:#fff;">Σύνολα</button>
</div>


    <ul id="pairList" class="list"></ul>
  `;

    const nameSelect = document.getElementById("nameSelect");
    const formSelect = document.getElementById("formSelect");
    const pairList = document.getElementById("pairList");
    const addBtn = document.getElementById("addBtn");
    const totalsBtn = document.getElementById("totalsBtn");

    [addBtn, totalsBtn].forEach((btn) =>
      Object.assign(btn.style, {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        padding: "6px 10px",
      })
    );

    tabData[1].forEach(
      (n) => (nameSelect.innerHTML += `<option>${n}</option>`)
    );
    tabData[2].forEach(
      (f) => (formSelect.innerHTML += `<option>${f}</option>`)
    );

    // --- totals button ---
    totalsBtn.addEventListener("click", () => {
      const formCounts = {};
      tabData[0].forEach((order) =>
        (order.forms || []).forEach((f) => {
          formCounts[f] = (formCounts[f] || 0) + 1;
        })
      );

      if (Object.keys(formCounts).length === 0) {
        alert("Δεν υπάρχουν έντυπα για υπολογισμό.");
        return;
      }

      const overlay = document.createElement("div");
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "500",
      });

      const box = document.createElement("div");
      Object.assign(box.style, {
        background: "#1f1f1f",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "250px",
        color: "#fff",
        fontSize: "16px",
        fontFamily: "'Times New Roman', Times, serif", // 👈 εδώ αλλάξαμε
      });

      // ΜΟΝΟ λίστα με έντυπο και πόσα έχει
      Object.entries(formCounts).forEach(([form, count], idx) => {
        const p = document.createElement("p");
        p.textContent = `${form}: ${count}`;
        p.style.margin = "4px 0";
        p.style.padding = "4px";
        p.style.background = idx % 2 === 0 ? "#2a2a2a" : "#333";
        p.style.borderRadius = "6px";
        box.appendChild(p);
      });

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "Κλείσιμο";
      Object.assign(closeBtn.style, {
        marginTop: "10px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        padding: "6px 10px",
        fontFamily: "'Times New Roman', Times, serif", // 👈 ίδιο και στο κουμπί
      });
      closeBtn.onclick = () => document.body.removeChild(overlay);
      box.appendChild(closeBtn);

      overlay.appendChild(box);
      document.body.appendChild(overlay);
    });

    function updateList() {
      pairList.innerHTML = "";
      tabData[0].forEach((item, idx) => {
        const li = document.createElement("li");
        Object.assign(li.style, {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#1f1f1f",
          marginBottom: "6px",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "16px",
          color: "#fff",
        });

        const span = document.createElement("span");
        span.innerHTML = `<strong><em>${
          item.name
        }</em></strong><br><span style="font-size:14px;margin-top:4px;display:block;">${item.forms.join(
          ", "
        )}</span>`;
        if (item.marked) span.style.color = "limegreen";
        span.style.flex = "1";

        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "6px";

        const greenBtn = document.createElement("button");
        greenBtn.textContent = "✔";
        Object.assign(greenBtn.style, {
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        });
        greenBtn.addEventListener("click", () => {
          item.marked = !item.marked;
          span.style.color = item.marked ? "limegreen" : "#fff";
          saveData();
        });

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        Object.assign(delBtn.style, {
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#fff",
        });
        delBtn.addEventListener(
          "mouseover",
          () => (delBtn.style.color = "#ff3333")
        );
        delBtn.addEventListener(
          "mouseout",
          () => (delBtn.style.color = "#fff")
        );
        delBtn.addEventListener("click", () => {
          tabData[0].splice(idx, 1);
          saveData();
          updateList();
        });

        btnContainer.appendChild(greenBtn);
        btnContainer.appendChild(delBtn);

        li.appendChild(span);
        li.appendChild(btnContainer);

        pairList.appendChild(li);
      });

      checkTabsVisibility();
    }

    addBtn.onclick = () => {
      const n = nameSelect.value,
        f = formSelect.value;
      if (!n || !f) return;
      const existing = tabData[0].find((i) => i.name === n);
      if (existing) {
        if (!existing.forms.includes(f)) existing.forms.push(f);
      } else {
        tabData[0].push({ name: n, forms: [f] });
      }
      saveData();
      updateList();
    };

    updateList();
  }

  // --- Ευαγγελιζόμενοι & Έντυπα
  else if (index === 1 || index === 2) {
    const label = index === 1 ? "Πρόσθεσε ονόματα:" : "Πρόσθεσε έντυπα:";
    const placeholder = index === 1 ? "Γράψε όνομα" : "Γράψε έντυπο";
    content.innerHTML = `
    <p style="font-size:20px;font-family:'Comic Sans MS';">${label}</p>
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      <input type="text" id="nameInput" placeholder="${placeholder}" style="flex:1;" />
      <button id="addBtn">Προσθήκη</button>
    </div>
    <ul id="nameList" class="list"></ul>
  `;
    const nameInput = document.getElementById("nameInput");
    const nameList = document.getElementById("nameList");
    const addBtn = document.getElementById("addBtn");

    function updateList() {
      nameList.innerHTML = "";
      tabData[index].forEach((val, idx) => {
        const li = createListItem(
          val,
          () => {
            // onDelete
            tabData[index].splice(idx, 1);
            saveData();
            updateList();
          },
          () => {
            // onEdit
            const newVal = prompt("Επεξεργασία:", val);
            if (newVal && newVal.trim()) {
              const cleanNewVal = newVal.trim();

              // 1) ενημέρωση στην τρέχουσα λίστα (ευαγγελιζόμενοι ή έντυπα)
              tabData[index][idx] = cleanNewVal;

              // 2) ενημέρωση και στις παραγγελίες (tab 0)
              // αν index === 1 -> είναι όνομα (name), αν index === 2 -> είναι έντυπο (form)
              const field = index === 1 ? "name" : "form";
              updateOrdersReferences(val, cleanNewVal, field);

              saveData();

              // ανανέωση τρέχουσας λίστας
              updateList();

              // αν οι παραγγελίες είναι αυτή τη στιγμή ορατές -> ενημέρωσέ τες ζωντανά
              if (document.getElementById("pairList")) {
                renderOrdersList();
              }
            }
          }
        );
        nameList.appendChild(li);
      });
      checkTabsVisibility();
    }

    addBtn.onclick = () => {
      const val = nameInput.value.trim();
      if (!val) return;
      tabData[index].push(val);
      saveData();
      updateList();
      nameInput.value = "";
      nameInput.focus();
    };

    nameInput.onkeydown = (e) => {
      if (e.key === "Enter") addBtn.onclick();
    };

    updateList();
  }

  // --- Αφίσες
  else if (index === 3) {
    content.innerHTML = `
    <p style="font-family:'Comic Sans MS', cursive,sans-serif;font-size:20px;">Πρόσθεσε αφίσα στη λίστα:</p>
    <form id="posterForm" style="display:flex;flex-direction:column;gap:10px;margin-bottom:10px;">
      <input type="text" id="nameInput" placeholder="Γράψε μια αφίσα" style="padding:6px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;" />
      <div style="display:flex;gap:10px;">
        <select id="numberSelect" style="flex:1;padding:6px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
          <option value="">-- Αριθμός --</option>
          ${Array.from(
            { length: 10 },
            (_, i) => `<option value="${i + 1}">${i + 1}</option>`
          ).join("")}
        </select>
        <select id="statusSelect" style="flex:1;padding:6px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:#fff;">
          <option value="">-- Επιλογή τύπου --</option>
          <option value="Ανοιχτές">Ανοιχτές</option>
          <option value="Κλειστές">Κλειστές</option>
        </select>
        <button type="submit" id="addBtn" style="background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;padding:6px 10px;">Προσθήκη</button>
      </div>
    </form>
    <div style="flex:1; overflow-y:auto; height: calc(100vh - 120px);">
      <table id="posterTable" style="width:100%;border-collapse:collapse;text-align:center;background:#1f1f1f;color:#fff;">
        <thead style="background:#2d2d2d;">
          <tr><th>🗞️ Αφίσες</th><th>📖 Ανοιχτές</th><th>📕 Κλειστές</th><th>🧹Διαγραφή</th></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

    hideTabs();

    // Επιλογή όλων των κελιών της πρώτης γραμμής
    const headerCells = document.querySelectorAll("#posterTable thead th");
    headerCells.forEach((th, idx) => {
      th.style.padding = "10px 5px"; // padding πάνω/κάτω 10px, δεξιά/αριστερά 5px
      th.style.textAlign = "center"; // κεντράρισμα κειμένου
    });

    const posterForm = document.getElementById("posterForm");
    const nameInput = document.getElementById("nameInput");
    const numberSelect = document.getElementById("numberSelect");
    const statusSelect = document.getElementById("statusSelect");
    const tableBody = document.querySelector("#posterTable tbody");

    function updateTable() {
      tableBody.innerHTML = "";

      tabData[3].sort((a, b) => a.name.localeCompare(b.name, "el"));

      let totalOpen = 0;
      let totalClosed = 0;

      tabData[3].forEach((item, idx) => {
        const tr = document.createElement("tr");
        // Εναλλαγή χρώματος φόντου για ευκολότερη ανάγνωση
        tr.style.background = idx % 2 === 0 ? "#1f1f1f" : "#2a2a2a";
        tr.style.borderBottom = "1px solid #444"; // διαχωριστική γραμμή
        tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.open || ""}</td>
      <td>${item.closed || ""}</td>
      <td></td>
    `;

        totalOpen += item.open || 0;
        totalClosed += item.closed || 0;

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.style.background = "none";
        delBtn.style.border = "none";
        delBtn.style.cursor = "pointer";
        delBtn.style.fontSize = "16px";
        delBtn.style.color = "#fff";
        delBtn.addEventListener(
          "mouseover",
          () => (delBtn.style.color = "#ff3333")
        );
        delBtn.addEventListener(
          "mouseout",
          () => (delBtn.style.color = "#fff")
        );
        delBtn.addEventListener("click", () => {
          tabData[3].splice(idx, 1);
          saveData();
          updateTable();
        });

        tr.children[3].appendChild(delBtn);
        tableBody.appendChild(tr);
      });

      // Προσθήκη σειράς συνολικών
      const totalRow = document.createElement("tr");
      totalRow.innerHTML = `
    <td style="font-weight:bold; color:#aaa; padding-top:10px;">Σύνολο:</td>
    <td style="color:#aaa; padding-top:10px;">${totalOpen}</td>
    <td style="color:#aaa; padding-top:10px;">${totalClosed}</td>
    <td></td>
  `;
      totalRow.style.borderTop = "2px solid #555"; // πιο έντονη διαχωριστική γραμμή
      totalRow.style.background = "#1f1f1f";
      tableBody.appendChild(totalRow);

      checkTabsVisibility();
    }

    function addItem() {
      const name = nameInput.value.trim();
      const number = parseInt(numberSelect.value);
      const status = statusSelect.value;
      if (!name || !number || !status) return;

      let existing = tabData[3].find((i) => i.name === name);
      if (existing) {
        if (status === "Ανοιχτές")
          existing.open = (existing.open || 0) + number;
        else existing.closed = (existing.closed || 0) + number;
      } else {
        const newItem = { name };
        if (status === "Ανοιχτές") newItem.open = number;
        else newItem.closed = number;
        tabData[3].push(newItem);
      }

      saveData();
      updateTable();
      nameInput.value = "";
      numberSelect.value = "";
      statusSelect.value = "";
      nameInput.focus();
    }

    // --- Prevent form submit από refresh
    posterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      addItem();
    });

    updateTable();

    addBtn.addEventListener("click", addItem);
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addItem();
    });
  }
}

// ------------------
// Backup / Restore (Browser μόνο)
// ------------------
// const createBackupBtn = document.getElementById("createBackupBtn");
// const restoreBackupBtn = document.getElementById("restoreBackupBtn");

// function showSuccess() {
//   const overlay = document.getElementById("successOverlay");
//   if (!overlay) return;
//   overlay.style.display = "flex";
//   setTimeout(() => (overlay.style.display = "none"), 1500);
// }

// function createBackup() {
//   const dataStr = JSON.stringify(tabData, null, 2);
//   try {
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "backup.json";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     showSuccess();
//   } catch (err) {
//     alert("⚠️ Δεν ήταν δυνατή η λήψη του backup.");
//     console.error(err);
//   }
// }

// function restoreBackup() {
//   const fileInput = document.createElement("input");
//   fileInput.type = "file";
//   fileInput.accept = "application/json";
//   fileInput.onchange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       try {
//         tabData = JSON.parse(ev.target.result);
//         saveData();
//         showSuccess();
//         showTab(0);
//         alert("✅ Το backup έγινε restore!");
//       } catch (err) {
//         alert("⚠️ Σφάλμα κατά την ανάγνωση του backup.");
//         console.error(err);
//       }
//     };
//     reader.readAsText(file);
//   };
//   fileInput.click();
// }

// // Συνδέουμε τα κουμπιά
// if (createBackupBtn) createBackupBtn.onclick = createBackup;
// if (restoreBackupBtn) restoreBackupBtn.onclick = restoreBackup;

// ------------------
// Κουμπί Home 🏠
// ------------------
let homeBtn = document.getElementById("homeBtn");
if (!homeBtn) {
  homeBtn = document.createElement("button");
  homeBtn.id = "homeBtn";
  homeBtn.innerHTML = "🏠";
  Object.assign(homeBtn.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "8px",
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 200,
    display: "none",
  });
  document.body.appendChild(homeBtn);
}

homeBtn.onclick = () => {
  const welcome = document.getElementById("welcome");
  if (!welcome) return;

  // fade in Welcome
  welcome.style.display = "flex";
  welcome.classList.add("fade");
  setTimeout(() => welcome.classList.add("show"), 50);

  // fade out Home button
  homeBtn.classList.remove("show");
  setTimeout(() => (homeBtn.style.display = "none"), 500);

  // Κρύβουμε το κουμπί showTabsBtn
  showTabsBtn.style.display = "none";

  // Απενεργοποίηση ενεργών tabs
  tabs.forEach((btn) => btn.classList.remove("active"));
};

// // Listener για το κουμπί Δημιουργία Αντίγραφου Ασφαλείας
// document.getElementById("createBackupBtn").addEventListener("click", () => {
//   const myData = {
//     users: [{ name: "Stef", age: 23 }],
//     settings: { theme: "dark" },
//   };
//   createBackup(myData);
// });

// ------------------
// Αλφαβητική ταξινόμηση δεδομένων
// ------------------

// Λειτουργία ταξινόμησης για λίστες και αφίσες
function sortAllData() {
  // --- Παραγγελίες (index 0) ---
  if (tabData[0]) {
    tabData[0].sort((a, b) => a.name.localeCompare(b.name, "el"));
  }

  // --- Ευαγγελιζόμενοι & Έντυπα (index 1 και 2) ---
  [1, 2].forEach((idx) => {
    if (tabData[idx]) {
      tabData[idx].sort((a, b) => a.localeCompare(b, "el"));
    }
  });

  // --- Αφίσες (index 3) ---
  if (tabData[3]) {
    tabData[3].sort((a, b) => a.name.localeCompare(b.name, "el"));
  }
}

// Κλήση ταξινόμησης πριν εμφανίσουμε οτιδήποτε
sortAllData();
saveData();

// --- helper: αντικατάσταση αναφορών στις παραγγελίες (tab 0)
function updateOrdersReferences(oldVal, newVal, field) {
  // field: "name" | "form" | "both"
  tabData[0].forEach((order) => {
    if (!order) return;
    // αντικατάσταση στο όνομα παραγγελίας
    if (
      (field === "name" || field === "both") &&
      typeof order.name === "string" &&
      order.name === oldVal
    ) {
      order.name = newVal;
    }
    // αντικατάσταση στα έντυπα της παραγγελίας (forms array)
    if ((field === "form" || field === "both") && Array.isArray(order.forms)) {
      order.forms = order.forms.map((f) => (f === oldVal ? newVal : f));
    }
  });
}

// --- global renderer για το tab "Παραγγελίες" (θα το καλέσεις όπου χρειάζεται)
function renderOrdersList() {
  const pairList = document.getElementById("pairList");
  if (!pairList) return; // αν το tab 0 δεν είναι ενεργό, τίποτα να κάνουμε

  pairList.innerHTML = "";

  tabData[0].forEach((item, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.background = "#1f1f1f";
    li.style.marginBottom = "6px";
    li.style.padding = "6px 10px";
    li.style.borderRadius = "6px";
    li.style.fontSize = "16px";
    li.style.color = "#fff";

    const span = document.createElement("span");
    span.innerHTML = `<strong><em>${
      item.name
    }</em></strong><br><span style="font-size:14px;margin-top:4px;display:block;">${(
      item.forms || []
    ).join(", ")}</span>`;
    if (item.marked) span.style.color = "limegreen";
    span.style.flex = "1";

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "6px";

    const greenBtn = document.createElement("button");
    greenBtn.textContent = "✅";
    greenBtn.style.background = "none";
    greenBtn.style.border = "none";
    greenBtn.style.cursor = "pointer";
    greenBtn.style.fontSize = "16px";
    greenBtn.addEventListener("click", () => {
      item.marked = !item.marked;
      span.style.color = item.marked ? "limegreen" : "#fff";
      saveData();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.style.background = "none";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.style.fontSize = "16px";
    delBtn.style.color = "#fff";
    delBtn.addEventListener(
      "mouseover",
      () => (delBtn.style.color = "#ff3333")
    );
    delBtn.addEventListener("mouseout", () => (delBtn.style.color = "#fff"));
    delBtn.addEventListener("click", () => {
      tabData[0].splice(idx, 1);
      saveData();
      renderOrdersList();
    });

    btnContainer.appendChild(greenBtn);
    btnContainer.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(btnContainer);

    pairList.appendChild(li);
  });

  checkTabsVisibility();
}

//////////////////////////////////////////////////////////////////////////////////////
