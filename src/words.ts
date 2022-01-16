import wl from "./assets/words.txt?raw"
import excluded from "./assets/offensive-words.txt?raw"

const words = wl.trim().split("\n")

export const wordsByLength: string[][] = []

const excludedWords = new Set(
  excluded
    .trim()
    .split("\n")
    .filter(word => word[0] !== "#")
)

words
  .filter(word => word[0] !== "#" && !excludedWords.has(word))
  .filter(word => /^[a-z]+$/i.test(word))
  .forEach(word => {
    ;(wordsByLength[word.length] ??= []).push(word)
  })

const wordsByLengthSet = wordsByLength.map(
  list => new Set(list.map(word => word.toLowerCase()))
)

export function isValidWord(word: string) {
  return wordsByLengthSet[word.length]?.has(word.toLowerCase()) || false
}
