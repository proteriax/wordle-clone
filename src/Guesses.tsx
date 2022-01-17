import { memo } from "react"
import styled from "@emotion/styled"
import { Modifier } from "./Keyboard"

export type KeyGuess = {
  letter: string
  modifier: Modifier
}

function forEach2(
  left: string,
  right: string,
  fn: (left: string, right: string, i: number) => void
) {
  for (let i = 0; i < left.length; i++) {
    fn(left[i], right[i], i)
  }
}

export const getKeyGuess = (guess: string, answer: string) => {
  const slots: KeyGuess[] = Array(guess.length)
  const used = new Set<number>()
  forEach2(guess, answer, (g, a, i) => {
    if (g === a) {
      used.add(i)
      slots[i] = { letter: g, modifier: Modifier.Correct }
    }
  })
  Array.from(guess).forEach((g, i) => {
    if (slots[i] != null) return
    for (let j = 0; j < answer.length; j++) {
      const v = answer[j]
      if (i === j || used.has(j)) continue
      if (v === g) {
        used.add(j)
        slots[i] = { letter: g, modifier: Modifier.Almost }
        break
      }
    }
  })
  Array.from(guess).forEach((letter, i) => {
    if (!slots[i]) {
      slots[i] = { letter, modifier: Modifier.Wrong }
    }
  })
  return slots
}

const Container = styled.div`
  margin-bottom: 20px;
  text-align: center;
`
const Row = styled.div`
  margin-bottom: 8px;
`

const Slot = styled.div<{ modifier?: Modifier }>`
  --size: 2em;
  background-color: ${p =>
    p.modifier === Modifier.Correct
      ? "var(--background-correct)"
      : p.modifier === Modifier.Almost
      ? "var(--background-almost)"
      : p.modifier === Modifier.Wrong
      ? "var(--background-wrong)"
      : "var(--background-color)"};
  border: 2px solid ${p => (p.modifier ? "transparent" : "var(--guess-border")};
  color: var(--text-color);
  display: inline-block;
  font-size: 30px;
  font-weight: 600;
  text-transform: uppercase;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  text-align: center;
  &:not(:last-of-type) {
    margin-right: 8px;
  }
  @media (max-width: 800px) {
    --size: 1.8em;
  }
`

const Guess = memo<{ guess: KeyGuess[] }>(({ guess }) => (
  <Row>
    {guess.map((slot, i) => (
      <Slot key={i} modifier={slot.modifier}>
        {slot.letter}
      </Slot>
    ))}
  </Row>
))

const Input: React.FC<{ value: string; length: number }> = ({ value, length }) => (
  <Row>
    {Array(length)
      .fill(0)
      .map((_, i) => (
        <Slot key={i}>{value[i] ?? " "}</Slot>
      ))}
  </Row>
)

export const Guesses: React.FC<{
  guesses: KeyGuess[][]
  answer: string
  input?: string
  emptyBlocks: number
}> = ({ guesses, answer, input, emptyBlocks }) => (
  <Container>
    {guesses.map((guess, i) => (
      <Guess guess={guess} key={i} />
    ))}
    {!!input && <Input length={answer.length} value={input} />}
    {emptyBlocks > 0 &&
      Array(emptyBlocks)
        .fill(0)
        .map((_, i) => (
          <Row key={i}>
            {Array(answer.length)
              .fill(0)
              .map((_, i) => (
                <Slot key={i}>{" "}</Slot>
              ))}
          </Row>
        ))}
  </Container>
)
