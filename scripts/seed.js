const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const seedData = async () => {
  try {
    console.log('Seeding data to Firestore...');

    // 1. Profile Info
    await db.collection('portfolio').doc('profile').set({
      name: 'Billal Atbata',
      title: 'Étudiant en Informatique',
      subtitle: 'Futur Ingénieur en Cybersécurité',
      email: 'atbatabillal158@gmail.com',
      phone: '07 82 58 24 30',
      location: 'Créteil, Île-de-France, France',
      about: "Actuellement en Bachelor 1 à l'ECE Paris après une classe préparatoire à l'ESI d'Alger, je souhaite intégrer votre Licence en Informatique. Mon objectif est de consolider mes bases théoriques afin de me spécialiser, à terme, en ingénierie de la cybersécurité pour protéger les systèmes d'information complexes."
    });

    // 2. Education
    const educationRef = db.collection('portfolio').doc('education').collection('items');
    await educationRef.add({
      title: 'Bachelor 1 Informatique',
      school: 'ECE Paris (Groupe OMNES Éducation)',
      year: '2026',
      description: 'Matières : Algorithmique, Architecture systèmes, Réseaux.',
      order: 1
    });
    await educationRef.add({
      title: 'Cycle Préparatoire Informatique (1ère année)',
      school: "École Nationale Supérieure d'Informatique (ESI) - Alger",
      year: '2024 - 2025',
      description: 'Validée avec une moyenne de 13,48/20.',
      order: 2
    });
    await educationRef.add({
      title: 'Baccalauréat Mathématiques',
      school: 'Lycée ATBATA - Timizart',
      year: '2023 - 2024',
      description: 'Obtenu avec Mention Très Bien (17,91/20).',
      order: 3
    });

    // 3. Projects
    const projectsRef = db.collection('portfolio').doc('projects').collection('items');
    await projectsRef.add({
      title: 'Système de gestion de bibliothèque',
      language: 'C',
      location: 'ESI Alger',
      description: "Développement complet d'un programme de gestion dynamique d'ouvrages (ajout, recherche, suppression).",
      order: 1
    });
    await projectsRef.add({
      title: 'Implémentation de structures de données',
      language: 'C',
      location: 'ESI Alger',
      description: "Création et manipulation algorithmique de piles, files, listes chaînées et arbres binaires.",
      order: 2
    });
    await projectsRef.add({
      title: 'Gestion de contacts téléphoniques',
      language: 'Assembleur 8086',
      location: 'ESI Alger',
      description: "Application système bas niveau interagissant avec le processeur pour stocker et rechercher des contacts.",
      order: 3
    });

    // 4. Skills
    await db.collection('portfolio').doc('skills').set({
      techniques: ['C', 'Assembleur 8086', 'Python', 'Bash/Shell'],
      systemes: ['Linux (Ubuntu)', 'Windows'],
      expertise: ['Algorithmique', 'Structures de données', 'Bases en Cybersécurité'],
      langues: ['Français (B2)', 'Anglais (B2)', 'Arabe (Bilingue)', 'Kabyle (Maternelle)']
    });

    console.log('Seeding successful!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data: ', error);
    process.exit(1);
  }
};

seedData();
