const FormatBirthDate = dob => {
    const dateObject = new Date(dob);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
    const day = dateObject.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

const RegistrationNumber = () => {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Get current date in 'ymd' format
    const randomNumbers = getRandomInt(10, 9999).toString().padStart(4, '0'); // Generate 10 random numbers
    const reg_no = `R${currentDate}${randomNumbers}`; // Concatenate prefix, date, and random numbers
    return reg_no;
};

module.exports = { FormatBirthDate, RegistrationNumber }
