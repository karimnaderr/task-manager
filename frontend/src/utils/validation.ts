export const validatePassword = (password: string): string => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
    return "";
  };
  
  export const validateName = (name: string): string => {
    if (!name) return "This field is required.";
    const regex = /^[A-Za-z]+$/;
    return regex.test(name) ? "" : "Only letters are allowed.";
  };
  
  export const validateEmail = (email: string): string => {
    if (!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email format.";
  };
  