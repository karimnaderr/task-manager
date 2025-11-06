export const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength) throw new Error("Password must be at least 8 characters.");
    if (!hasNumber || !hasLetter || !hasSpecialChar) throw new Error("Password must contain at least one number, letter, and special character.");
    return null;
};

export const validateTask = (title: string, description: string): string | null => {
    if (!title || !title.trim()) return "Title is required";
    if (!description || !description.trim()) return "Description is required";
  
    const lettersRegex = /^[A-Za-z\s]+$/; 
    if (!lettersRegex.test(title)) return "Title can only contain letters";
    
  
    return null; 
};
  