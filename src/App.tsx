import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import { sample } from "lodash"
import styled from "@emotion/styled"
import { wordsByLength, isValidWord } from "./words"
import { Keyboard, Modifier } from "./Keyboard"
import { getKeyGuess, Guesses } from "./Guesses"
import { Dialog } from "./Dialog"
import { Config, ConfigDialog } from "./Config"
import { getShareable } from "./Statistics"
import { useCacheState } from "./useCacheState"

const defaultConfig: Config = {
  wordLength: 5,
  maxAttempts: 6,
}
const Container = styled.div``
const Main = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Shareable = styled.div`
  white-space: pre-wrap;
  margin-bottom: 15px;
  min-width: 200px;
  line-height: 1.5em;
`
const CheatContainer = styled.div`
  margin-bottom: 10px;
  text-align: center;
`

const Header = styled.header`
  background: #eee;
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 12px 24px 10px;
  margin: 0 0 10px;
  align-items: center;
`
const Title = styled.div`
  flex-grow: 1;
  text-align: center;
  font-weight: 600;
`

function getRandomWord(length: number) {
  return sample(wordsByLength[length])!.toLowerCase()
}

const ALLOW_PLURAL = true

export default function App() {
  const [config, setConfig] = useCacheState("app.config", defaultConfig)
  const [word, setWord] = useCacheState("app.word", () =>
    getRandomWord(defaultConfig.wordLength)
  )
  const [guesses, setGuesses] = useCacheState<string[]>("app.guesses", () => [])
  const [input, setInput] = useCacheState("app.input", "")
  const container = useRef<HTMLDivElement>(null)

  const [showConfig, setShowConfig] = useState(false)
  const [showCheat, setShowCheat] = useState(false)

  const guessesData = useMemo(
    () => guesses.map(guess => getKeyGuess(guess, word)),
    [guesses, word]
  )
  const modifierMap = useMemo(() => {
    const res: Record<string, Modifier> = {}
    guessesData.forEach(keys => {
      keys.forEach(({ letter, modifier }) => {
        letter = letter.toUpperCase()
        if (res[letter] == null || modifier < res[letter]) {
          res[letter] = modifier
        }
      })
    })
    return res
  }, [guessesData])

  const [dialog, setDialog] = useState<{
    title: string
    children: React.ReactNode
  }>()

  const onReset = useCallback(() => {
    setGuesses([])
    setInput("")
    setShowCheat(false)
    setWord(getRandomWord(config.wordLength))
    container.current!.focus()
  }, [config.wordLength])

  const onType = useCallback(
    (key: string) => {
      if (input.length >= word.length) return
      setInput(input + key.toLowerCase())
      ;(document.activeElement as HTMLElement).blur()
    },
    [input, word.length]
  )

  const onBackspace = useCallback(() => {
    setInput(input => input.slice(0, -1))
  }, [])

  const onCorrect = useCallback(() => {
    const text = getShareable(config, guessesData)
    setDialog({
      title: ":-)",
      children: (
        <div>
          <Shareable>{text}</Shareable>
          <button onClick={() => navigator.clipboard.writeText(text)}>
            Copy to clipboard
          </button>
        </div>
      ),
    })
  }, [guessesData])

  const onCorrectLatest = useRef(onCorrect)
  onCorrectLatest.current = onCorrect

  const onEnter = useCallback(() => {
    if (input.length < word.length) return

    if (
      !isValidWord(input) &&
      (!ALLOW_PLURAL || (input.endsWith("s") && isValidWord(input.slice(0, -1))))
    ) {
      setDialog({
        title: "Error",
        children: <span>Invalid word: {input}</span>,
      })
      return
    }

    setGuesses(guesses => guesses.concat(input))
    setInput("")

    if (input === word) {
      requestAnimationFrame(onCorrectLatest.current)
    } else if (guesses.length + 1 >= config.maxAttempts) {
      setDialog({
        title: ":-(",
        children: <div>The word is {word}</div>,
      })
    }
  }, [input, guesses.length, config.maxAttempts, word, setGuesses, setInput])

  useEffect(() => {
    const keyup = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key === "Backspace") {
        onBackspace()
      }
    }

    const keypress = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key === "Enter") {
        onEnter()
      } else if (e.key === "Backspace") {
        onBackspace()
      } else if (
        e.key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        onType(e.key.toLowerCase())
      }
    }
    document.body.addEventListener("keypress", keypress)
    document.body.addEventListener("keyup", keyup)
    return () => {
      document.body.removeEventListener("keypress", keypress)
      document.body.removeEventListener("keyup", keyup)
    }
  }, [onEnter, onBackspace, onType])

  return (
    <Container ref={container}>
      <Header>
        <button onClick={onReset}>Reset</button>
        <button onClick={() => setGuesses(g => g.slice(0, -1))}>Undo</button>
        <Title>Wordle</Title>
        {!showCheat && <button onClick={() => setShowCheat(true)}>Give Up</button>}
        <button onClick={() => setShowConfig(true)}>Config</button>
      </Header>
      <Main>
        <Guesses
          guesses={guessesData}
          answer={word}
          input={input}
          emptyBlocks={config.maxAttempts - guesses.length - (input ? 1 : 0)}
        />
        {showCheat && <CheatContainer>{word}</CheatContainer>}
        <Keyboard
          modifiers={modifierMap}
          onType={onType}
          onBackspace={onBackspace}
          onEnter={onEnter}
        />
        {dialog && (
          <Dialog show title={dialog.title} onClose={() => setDialog(undefined)}>
            {dialog.children}
          </Dialog>
        )}
        {showConfig && (
          <ConfigDialog
            config={config}
            onChange={setConfig}
            onClose={() => setShowConfig(false)}
          />
        )}
      </Main>
    </Container>
  )
}
