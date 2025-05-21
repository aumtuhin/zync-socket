export const getRandomLetter = (options = { uppercase: false }) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const letter = letters[Math.floor(Math.random() * letters.length)]
  return options.uppercase ? letter.toUpperCase() : letter
}
