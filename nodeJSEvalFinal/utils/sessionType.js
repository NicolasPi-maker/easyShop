
// Return a random session type to test JWT expiration cases
const setRandomSessionType = () => {
    const sessionTypes = ['onBorne', 'onMobile', 'onDesktop'];
    const randomIndex = Math.floor(Math.random() * sessionTypes.length);
    return sessionTypes[randomIndex];
}

console.log(setRandomSessionType());

module.exports = setRandomSessionType;