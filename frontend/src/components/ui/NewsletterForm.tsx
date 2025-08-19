import React from 'react';

const NewsletterForm: React.FC = () => (
  <form className="bg-white rounded-md shadow p-8 flex flex-col gap-4 max-w-md w-full">
    <h3 className="text-xl font-bold mb-2 text-primary-blue">Restez informé(e)</h3>
    <p className="text-neutral-700 mb-2">Recevez les meilleurs événements et actualités chrétiennes chaque semaine.</p>
    <input type="email" placeholder="Votre email" className="border border-neutral-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
    <button type="submit" className="bg-primary-blue text-white rounded-md px-4 py-2 font-semibold hover:bg-primary-blue/90 transition">S'inscrire</button>
  </form>
);

export default NewsletterForm; 