import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

// Using the same config from src/utils/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyCPX6zHkZ19WEtPFylqk4OV7Ro3PIMT4BA",
  authDomain: "techcon-14e51.firebaseapp.com",
  projectId: "techcon-14e51",
  storageBucket: "techcon-14e51.firebasestorage.app",
  messagingSenderId: "553137103065",
  appId: "1:553137103065:web:081841c106580305e51ec8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    const data = JSON.parse(fs.readFileSync('registrations.json', 'utf8'));
    const regs = data.registrations || [];
    
    let maxNum = 0;

    console.log(`Found ${regs.length} registrations to migrate.`);

    for (const reg of regs) {
      if (reg.id) {
        // Parse number from e.g. TC26A006
        const numPart = parseInt(reg.id.replace('TC26A', ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }

        // Write document using ID as doc ID
        await setDoc(doc(db, 'registrations', reg.id), reg);
        console.log(`Migrated ${reg.id} - ${reg.fullName}`);
      }
    }

    // Since maxNum is 9 (from TC26A009), next should be 10. We store 9.
    const currentCount = maxNum > 0 ? maxNum : 0;
    await setDoc(doc(db, 'settings', 'counters'), {
      registrationCount: currentCount
    });
    console.log(`Successfully initialized counter to ${currentCount}`);
    
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
}

seed();
