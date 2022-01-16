import { Modifier } from "./Keyboard"
import type { KeyGuess } from "./Guesses"
import type { Config } from "./Config"

export function getShareable(config: Config, guesses: KeyGuess[][]) {
  return [`Game ${guesses.length}/${config.maxAttempts}`]
    .concat(
      guesses.map(guess =>
        guess
          .map(({ modifier }) =>
            modifier === Modifier.Correct
              ? "🟩"
              : modifier === Modifier.Almost
              ? "🟨"
              : "⬛"
          )
          .join("")
      )
    )
    .join("\n")
}
