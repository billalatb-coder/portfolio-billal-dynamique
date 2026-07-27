import { db } from '@/lib/firebase/firebaseAdmin';

async function getPortfolioData() {
  try {
    const profileDoc = await db.collection('portfolio').doc('profile').get();
    
    // If we can read profile and it exists, use Firestore data
    if (profileDoc.exists) {
      const skillsDoc = await db.collection('portfolio').doc('skills').get();
      const educationSnapshot = await db.collection('portfolio').doc('education').collection('items').orderBy('order').get();
      const projectsSnapshot = await db.collection('portfolio').doc('projects').collection('items').orderBy('order').get();

      return {
        profile: profileDoc.data(),
        skills: skillsDoc.exists ? skillsDoc.data() : null,
        education: educationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        projects: projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      };
    }
    throw new Error('No data found in Firestore, falling back to mock data');
  } catch (error) {
    console.warn('Using mock data because Firestore is disabled or empty:', error.message);
    
    // MOCK DATA FALLBACK (Based on CV)
    return {
      profile: {
        name: 'Billal Atbata',
        title: 'Étudiant en Informatique',
        subtitle: 'Futur Ingénieur en Cybersécurité',
        email: 'atbatabillal158@gmail.com',
        about: "Actuellement en Bachelor 1 à l'ECE Paris après une classe préparatoire à l'ESI d'Alger, je souhaite intégrer votre Licence en Informatique. Mon objectif est de consolider mes bases théoriques afin de me spécialiser, à terme, en ingénierie de la cybersécurité pour protéger les systèmes d'information complexes."
      },
      skills: {
        techniques: ['C', 'Assembleur 8086', 'Python', 'Bash/Shell'],
        systemes: ['Linux (Ubuntu)', 'Windows'],
        expertise: ['Algorithmique', 'Structures de données', 'Bases en Cybersécurité'],
        langues: ['Français (B2)', 'Anglais (B2)', 'Arabe (Bilingue)', 'Kabyle (Maternelle)']
      },
      education: [
        { id: '1', year: '2026', title: 'Bachelor 1 Informatique', school: 'ECE Paris (Groupe OMNES Éducation)', description: 'Matières : Algorithmique, Architecture systèmes, Réseaux.' },
        { id: '2', year: '2024 - 2025', title: 'Cycle Préparatoire Informatique (1ère année)', school: "École Nationale Supérieure d'Informatique (ESI) - Alger", description: 'Validée avec une moyenne de 13,48/20.' },
        { id: '3', year: '2023 - 2024', title: 'Baccalauréat Mathématiques', school: 'Lycée ATBATA - Timizart', description: 'Obtenu avec Mention Très Bien (17,91/20).' }
      ],
      projects: [
        { id: '1', title: 'Système de gestion de bibliothèque', language: 'C', location: 'ESI Alger', description: "Développement complet d'un programme de gestion dynamique d'ouvrages (ajout, recherche, suppression)." },
        { id: '2', title: 'Implémentation de structures de données', language: 'C', location: 'ESI Alger', description: "Création et manipulation algorithmique de piles, files, listes chaînées et arbres binaires." },
        { id: '3', title: 'Gestion de contacts téléphoniques', language: 'Assembleur 8086', location: 'ESI Alger', description: "Application système bas niveau interagissant avec le processeur pour stocker et rechercher des contacts." }
      ]
    };
  }
}

export default async function Home() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erreur de connexion à Firestore</h1>
          <p>L'API Firestore n'est pas activée sur votre projet Firebase ou les données n'ont pas été seedées.</p>
          <p className="text-sm text-gray-400 mt-2">Veuillez activer Firestore dans la console Google Cloud / Firebase.</p>
        </div>
      </div>
    );
  }

  const { profile, skills, education, projects } = data;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/20 via-gray-950 to-gray-950 -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          {profile?.name || 'Billal Atbata'}
        </h1>
        <h2 className="text-2xl md:text-3xl text-teal-400 font-medium mb-6">
          {profile?.title || 'Étudiant en Informatique'} <span className="text-gray-500">|</span> <span className="text-gray-300">{profile?.subtitle || 'Futur Ingénieur en Cybersécurité'}</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-400 leading-relaxed mb-10">
          {profile?.about || 'Passionné par la cybersécurité et le développement.'}
        </p>
        <div className="flex gap-4">
          <a href="#projects" className="bg-teal-500 text-gray-950 px-6 py-3 rounded-full font-semibold hover:bg-teal-400 transition">Voir mes projets</a>
          <a href="#contact" className="border border-gray-700 px-6 py-3 rounded-full font-semibold hover:border-teal-500 hover:text-teal-400 transition">Contact</a>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-8 md:px-24 bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-10">Compétences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-xl font-semibold text-teal-400 mb-4">Techniques</h4>
            <div className="flex flex-wrap gap-2">
              {skills?.techniques?.map((s, i) => (
                <span key={i} className="bg-gray-800 px-3 py-1 rounded-md text-sm">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-xl font-semibold text-teal-400 mb-4">Systèmes</h4>
            <div className="flex flex-wrap gap-2">
              {skills?.systemes?.map((s, i) => (
                <span key={i} className="bg-gray-800 px-3 py-1 rounded-md text-sm">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-xl font-semibold text-teal-400 mb-4">Expertise</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {skills?.expertise?.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h4 className="text-xl font-semibold text-teal-400 mb-4">Langues</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {skills?.langues?.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-8 md:px-24">
        <h3 className="text-3xl font-bold mb-10">Formation</h3>
        <div className="space-y-8 max-w-4xl">
          {education?.map((item) => (
            <div key={item.id} className="border-l-2 border-teal-500 pl-6 relative">
              <div className="absolute w-4 h-4 bg-teal-500 rounded-full -left-[9px] top-1"></div>
              <span className="text-sm font-semibold text-teal-400 tracking-wider">{item.year}</span>
              <h4 className="text-xl font-bold mt-1">{item.title}</h4>
              <p className="text-gray-400 font-medium">{item.school}</p>
              <p className="mt-2 text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-8 md:px-24 bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-10">Projets Techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {projects?.map((item) => (
            <div key={item.id} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-teal-500 transition group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold group-hover:text-teal-400 transition">{item.title}</h4>
                <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">{item.language}</span>
              </div>
              <p className="text-sm text-teal-500 mb-4">{item.location}</p>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8 md:px-24 text-center">
        <h3 className="text-3xl font-bold mb-6">Me Contacter</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Je suis ouvert à de nouvelles opportunités. N'hésitez pas à me contacter par email.
        </p>
        <a href={`mailto:${profile?.email}`} className="bg-teal-500 text-gray-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-400 transition shadow-lg shadow-teal-500/20">
          Envoyer un message
        </a>
      </section>
    </main>
  );
}
