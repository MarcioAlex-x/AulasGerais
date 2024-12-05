import { initializeApp } from "www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "www.gstatic.com/firebasejs/9.22.1/firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAC3dV_uOTycG7jOlDMVMoiZGeVtKC-dDM",
  authDomain: "arquivos-de-aula-f0653.firebaseapp.com",
  projectId: "arquivos-de-aula-f0653",
  storageBucket: "arquivos-de-aula-f0653.appspot.com",
  messagingSenderId: "222299177082",
  appId: "1:222299177082:web:ce6884021cc68bda41bbc3",
  measurementId: "G-37GP6Y0D5D",
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Referências aos elementos do DOM
const uploadForm = document.getElementById("uploadForm");
const nameInput = document.getElementById("nameInput");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

// Enviar arquivo ao Firebase Storage
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const file = fileInput.files[0];

  if (!name || !file) {
    alert("Por favor, preencha o nome e selecione um arquivo.");
    return;
  }

  const fileRef = ref(storage, `uploads/${name}-${file.name}`);
  
  try {
    // Upload do arquivo
    await uploadBytes(fileRef, file);
    alert("Arquivo enviado com sucesso!");
    nameInput.value = "";
    fileInput.value = "";

    // Atualizar lista de arquivos enviados
    loadFiles();
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    alert("Falha ao enviar o arquivo. Tente novamente.");
  }
});

// Carregar lista de arquivos enviados
async function loadFiles() {
  fileList.innerHTML = ""; // Limpar lista
  const storageRef = ref(storage, "uploads/");
  
  try {
    const files = await listAll(storageRef);
    
    files.items.forEach(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="${url}" target="_blank">${itemRef.name}</a>
        <button onclick="downloadFile('${url}', '${itemRef.name}')">Baixar</button>
      `;
      fileList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar lista de arquivos:", error);
  }
}

// Função para download de arquivos
window.downloadFile = async (url, name) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

// Carregar lista de arquivos ao abrir a página
loadFiles();
