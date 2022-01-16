import styled from "@emotion/styled"

export enum Modifier {
  Correct = 1,
  Almost,
  Wrong,
}

enum KeyType {
  Letter = 1,
  Backspace,
  Enter,
}

type Key = {
  label: string
  type: KeyType
  width?: number
}

const keys = (letters: string): Key[] =>
  letters.split("").map(key => ({ label: key, type: KeyType.Letter }))

const qwerty: Key[][] = [
  [...keys("QWERTYUIOP")],
  [...keys("ASDFGHJKL")],
  [
    { label: "⌫", type: KeyType.Backspace, width: 1.7 },
    ...keys("ZXCVBNM"),
    { label: "Enter", type: KeyType.Enter, width: 1.7 },
  ],
]

const Container = styled.div`
  margin-bottom: 10px;
`

const KeyboardRow = styled.div`
  text-align: center;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`
const Keycap = styled.div<{ modifier?: Modifier; width?: number }>`
  --background: ${p =>
    p.modifier === Modifier.Correct
      ? "var(--background-correct)"
      : p.modifier === Modifier.Almost
      ? "var(--background-almost)"
      : p.modifier === Modifier.Wrong
      ? "var(--background-wrong)"
      : "#ddd"};
  --background-hover: #bbb;
  --width: ${p => (p.width ?? 1) * 2.5}em;
  --height: 3.3em;
  --margin: 5px;
  background-color: var(--background);
  border-radius: 3px;
  ${p => p.modifier === Modifier.Wrong && "color: #fff"};
  display: inline-block;
  height: var(--height);
  line-height: var(--height);
  text-align: center;
  user-select: none;
  width: var(--width);
  &:hover {
    background-color: var(--background-hover);
    transition: 0.2s;
  }
  &:not(:last-of-type) {
    margin-right: var(--margin);
  }
  @media (max-width: 800px) {
    --width: ${p => (p.width ?? 1) * 2}em;
    --margin: 3px;
  }
  @media (max-width: 600px) {
    --width: ${p => (p.width ?? 1) * 1.8}em;
  }
`

export const Keyboard: React.FC<{
  modifiers: { [key: string]: Modifier }
  layout?: Key[][]
  onEnter(): void
  onType(char: string): void
  onBackspace(): void
}> = ({ layout = qwerty, onBackspace, onType, onEnter, modifiers }) => {
  return (
    <Container>
      {layout.map((row, i) => (
        <KeyboardRow key={i}>
          {row.map((key, j) => (
            <Keycap
              width={key.width}
              modifier={key.type === KeyType.Letter ? modifiers[key.label] : undefined}
              key={j}
              onClick={
                key.type === KeyType.Letter
                  ? () => onType(key.label)
                  : key.type === KeyType.Enter
                  ? onEnter
                  : key.type === KeyType.Backspace
                  ? onBackspace
                  : undefined
              }
            >
              {key.label}
            </Keycap>
          ))}
        </KeyboardRow>
      ))}
    </Container>
  )
}
