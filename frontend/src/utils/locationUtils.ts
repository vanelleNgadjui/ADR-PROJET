/**
 * Utilitaires pour le traitement des localisations
 */

/**
 * Nettoie et raccourcit une adresse pour la base de données
 * @param address L'adresse complète
 * @param maxLength Longueur maximale (par défaut 100)
 * @returns L'adresse nettoyée et raccourcie
 */
export function cleanAndShortenAddress(address: string, maxLength: number = 100): string {
  if (!address) return '';
  
  // Supprimer les parties non essentielles
  let cleanedAddress = address
    // Supprimer "France métropolitaine"
    .replace(/,\s*France métropolitaine/gi, '')
    // Supprimer les codes postaux longs et répétitifs
    .replace(/,\s*\d{5},\s*France$/gi, ', France')
    // Supprimer les parties de rue très détaillées
    .replace(/\s*\/\s*[^,]+/g, '')
    // Nettoyer les espaces multiples
    .replace(/\s+/g, ' ')
    .trim();

  // Si encore trop long, garder les parties les plus importantes
  if (cleanedAddress.length > maxLength) {
    const parts = cleanedAddress.split(',').map(part => part.trim());
    
    // Stratégie de raccourcissement intelligente
    if (parts.length >= 3) {
      // Garder: ville principale, région/département, pays
      const city = parts.find(part => 
        !part.match(/^\d/) && // Pas un code postal
        !part.toLowerCase().includes('rue') && // Pas une rue
        !part.toLowerCase().includes('avenue') && // Pas une avenue
        part.length > 2
      ) || parts[0];
      
      const region = parts.find(part => 
        part !== city && 
        part.toLowerCase() !== 'france' &&
        part.length > 2
      );
      
      const country = parts.find(part => 
        part.toLowerCase().includes('france')
      ) || 'France';
      
      const result = [city, region, country].filter(Boolean).join(', ');
      
      if (result.length <= maxLength) {
        return result;
      }
    }
    
    // Dernière tentative : juste ville et pays
    const city = parts[0];
    const country = parts.find(part => 
      part.toLowerCase().includes('france')
    ) || 'France';
    
    const fallback = [city, country].join(', ');
    
    if (fallback.length <= maxLength) {
      return fallback;
    }
    
    // Tronquer brutalement si nécessaire
    return cleanedAddress.substring(0, maxLength - 3) + '...';
  }
  
  return cleanedAddress;
}

/**
 * Formate une adresse pour l'affichage
 * @param address L'adresse à formater
 * @returns L'adresse formatée pour l'affichage
 */
export function formatAddressForDisplay(address: string): string {
  if (!address) return '';
  
  // Pour l'affichage, on peut garder plus de détails
  return address
    .replace(/,\s*France métropolitaine/gi, ', France')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Valide qu'une adresse n'est pas trop longue pour la DB
 * @param address L'adresse à valider
 * @param maxLength Longueur maximale
 * @returns true si valide
 */
export function isAddressValid(address: string, maxLength: number = 100): boolean {
  return address.length <= maxLength;
}
