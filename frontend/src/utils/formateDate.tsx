const formatDate = (dateString, isTime = false) => {
    const date = new Date(dateString);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    if(isTime) {
        // Formatting hours, minutes, and seconds
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${day} ${month} ${year} : ${hours}:${minutes}:${seconds}`;
    }
    return `${day} ${month} ${year}`;
};

export { formatDate };