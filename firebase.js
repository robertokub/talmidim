// Importe as funções que você precisa dos SDKs que você precisa
import { initializeApp } from "firebase/app";
// Adicione a importação do Firestore para podermos usar o banco de dados
import { getFirestore } from "firebase/firestore";

// A configuração do Firebase do seu aplicativo web que você já pegou
const firebaseConfig = {
  apiKey: "AIzaSyBmhcpXxRwjYuWMt2ZGPJWdvp1-Ta98y10", // Sua chave de API está segura para ser exposta no frontend
  authDomain: "talmidim-8778e.firebaseapp.com",
  projectId: "talmidim-8778e",
  storageBucket: "talmidim-8778e.firebasestorage.app",
  messagingSenderId: "193643108224",
  appId: "1:193643108224:web:2ec2c4ceee107b0f7e1365"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Cloud Firestore e o exporta para que outros arquivos possam usá-lo
export const db = getFirestore(app);
