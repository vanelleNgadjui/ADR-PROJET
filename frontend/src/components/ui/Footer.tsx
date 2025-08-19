import React from 'react';

const Footer: React.FC = () => (
  <footer className="w-full py-8 px-8 bg-neutral-100 text-neutral-600 text-sm flex flex-col md:flex-row md:justify-between gap-4 mt-16 rounded-md">
    <div>
      © {new Date().getFullYear()} AGENDA DU ROYAUME. Tous droits réservés.
    </div>
    <div className="flex gap-4 flex-wrap">
      <a href="#" className="hover:underline rounded-md px-1">Mentions légales</a>
      <a href="#" className="hover:underline rounded-md px-1">CGU</a>
      <a href="#" className="hover:underline rounded-md px-1">Politique de confidentialité</a>
      <a href="#" className="hover:underline rounded-md px-1">Contact</a>
      <a href="#" className="hover:underline rounded-md px-1">Réseaux sociaux</a>
    </div>
  </footer>
);

export default Footer; 