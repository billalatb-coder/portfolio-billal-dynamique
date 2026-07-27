'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus('Sauvegarde...');
    
    try {
      const res = await fetch('/api/portfolio/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          title: e.target.title.value
        })
      });
      
      if (res.ok) {
        setStatus('Sauvegardé avec succès !');
        setTimeout(() => setStatus(''), 3000);
      } else {
        const data = await res.json();
        setStatus('Erreur : ' + (data.error || 'Firestore désactivé'));
      }
    } catch (err) {
      setStatus('Erreur de connexion');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl border border-gray-800 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Admin Login</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-teal-500 text-gray-950 font-bold py-2 rounded hover:bg-teal-400 transition">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-teal-400">Dashboard Administration</h1>
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              router.push('/');
            }}
            className="text-sm bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
          >
            Retour au site
          </button>
        </div>

        {status && <div className="mb-6 p-4 bg-teal-900/30 border border-teal-500 text-teal-400 rounded">{status}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Edit Form */}
          <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Mettre à jour le Profil</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-400">Nom Complet</label>
                <input name="name" type="text" defaultValue="Billal Atbata" className="w-full bg-gray-800 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-400">Titre</label>
                <input name="title" type="text" defaultValue="Étudiant en Informatique" className="w-full bg-gray-800 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500" />
              </div>
              <button type="submit" className="bg-teal-500 text-gray-950 px-4 py-2 rounded font-bold hover:bg-teal-400">
                Sauvegarder
              </button>
            </form>
          </section>

          {/* Info Card */}
          <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Statut Base de Données</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Ce dashboard vous permet d'ajouter ou de modifier vos informations en temps réel sur <strong>Firestore</strong>.
            </p>
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded text-sm text-red-400">
              <strong>Attention :</strong> Actuellement, Firestore n'est pas activé sur votre projet Google Cloud / Firebase. Les modifications ne seront pas sauvegardées tant que l'API Firestore ne sera pas activée dans votre console.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
