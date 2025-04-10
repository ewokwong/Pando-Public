/**
 * Function to calculate age from a given date of birth
 * @param {Date | string} dob - The user's date of birth
 * @returns {number} - The calculated age
 */
export const calculateAge = (dob: Date | string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
