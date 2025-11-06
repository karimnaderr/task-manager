export const validatePassword = (password: string): string | null => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) return "Password must be at least 8 characters.";
    if (!hasNumber || !hasLetter || !hasSpecialChar) return "Password must contain at least one number, letter, and special character.";
    
  
    return null; 
  };
  