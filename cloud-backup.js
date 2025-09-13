// cloud-backup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyD2OJZksrgnactkTZYZD7C1n61vrYC-89s",
  authDomain: "forms-service-334d7.firebaseapp.com",
  projectId: "forms-service-334d7",
  storageBucket: "forms-service-334d7.firebasestorage.app",
  messagingSenderId: "337660059515",
  appId: "1:337660059515:web:50be660c5e7e9067ca67de",
  measurementId: "G-4G4XWY2T0N",
};

// --- Init Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper για popup
function showPopup(message) {
  const popup = document.getElementById("popupMessage");
  if (!popup) return;

  popup.textContent = message;
  popup.classList.add("show");

  // Κλείσιμο μετά από 2 δευτερόλεπτα
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
    }, 300); // για smooth transition
  }, 3000);

  popup.style.display = "block";
}

function createCloudButtons() {
  const container = document.getElementById("backupButtons");
  if (!container) return;

  // Τοπικό κουμπί ήδη υπάρχει
  const localBtn = document.getElementById("createBackupBtn");

  // Δημιουργία cloud κουμπιών
  const backupCloudBtn = document.createElement("button");
  backupCloudBtn.textContent = "☁️ Backup to Cloud";

  const restoreCloudBtn = document.createElement("button");
  restoreCloudBtn.textContent = "☁️ Restore from Cloud";

  // Αντιγραφή στυλ από το local button
  [backupCloudBtn, restoreCloudBtn].forEach((btn) => {
    if (localBtn) btn.style.cssText = localBtn.style.cssText;
  });

  // Τοποθέτηση των cloud buttons
  if (localBtn && localBtn.parentNode) {
    localBtn.parentNode.insertBefore(backupCloudBtn, localBtn.nextSibling);
    localBtn.parentNode.insertBefore(
      restoreCloudBtn,
      backupCloudBtn.nextSibling
    );
  } else {
    container.appendChild(backupCloudBtn);
    container.appendChild(restoreCloudBtn);
  }

  // --- Backup στο Cloud ---
  backupCloudBtn.addEventListener("click", async () => {
    try {
      const tabData = JSON.parse(localStorage.getItem("tabData") || "{}");
      await setDoc(doc(db, "backups", "myData"), {
        tabData,
        token: "MY_SECRET_TOKEN",
        timestamp: Date.now(),
      });
      showPopup("🐾 Backup to Cloud Completed");
    } catch (err) {
      console.error("Σφάλμα backup:", err);
      showPopup("⚠️ Σφάλμα στο Backup");
    }
  });

  // --- Restore από Cloud ---
  restoreCloudBtn.addEventListener("click", async () => {
    try {
      const snap = await getDoc(doc(db, "backups", "myData"));
      if (!snap.exists()) {
        showPopup("⚠️ Δεν βρέθηκε backup στο Cloud");
        return;
      }
      const data = snap.data();
      if (data.token !== "MY_SECRET_TOKEN") {
        showPopup("⚠️ Μη έγκυρο backup token!");
        return;
      }
      localStorage.setItem("tabData", JSON.stringify(data.tabData));
      showPopup("🐾 Restore from Cloud Completed");
      setTimeout(() => location.reload(), 2200);
    } catch (err) {
      console.error("Σφάλμα restore:", err);
      showPopup("⚠️ Σφάλμα στο Restore");
    }
  });
}

window.addEventListener("DOMContentLoaded", createCloudButtons);
