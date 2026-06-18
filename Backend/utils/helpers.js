import crypto from 'crypto';

export const generateSlug = (prompt) => {
    // If no prompt, use a generic fallback
    const base = prompt ? prompt.substring(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'creation';
    
    // Clean up trailing or leading hyphens
    const cleanBase = base.replace(/^-+|-+$/g, '');
    
    // Generate a random 4 character hex string
    const randomSuffix = crypto.randomBytes(2).toString('hex');
    
    return `${cleanBase}-${randomSuffix}`;
};
