const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyCPX6zHkZ19WEtPFylqk4OV7Ro3PIMT4BA",
  authDomain: "techcon-14e51.firebaseapp.com",
  projectId: "techcon-14e51"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// NOTE: You must enable Email/Password authentication in your Firebase Console first!
async function setupAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@msftech26.com", "msftech26");
    console.log("Admin account created successfully:", userCredential.user.uid);
    console.log("Please delete this script after running it.");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Admin account already exists.");
      process.exit(0);
    }
    console.error("Error creating admin account:", error.message);
    process.exit(1);
  }
}

setupAdmin();
