export const inputClass = (value: string, error: string): string => {
    let classes = "form-control";
    if (error) {
      classes += " border-danger shadow-danger";
    } else if (value) {
      classes += " border-primary shadow-primary";
    }
    return classes;
  };
  