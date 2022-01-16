import styled from "@emotion/styled"
import {} from "react"
import { Dialog } from "./Dialog"

export interface Config {
  wordLength: number
  maxAttempts: number
}

const FormItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 13px;
`
const FormLabel = styled.div`
  width: 120px;
`
const FormValue = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  min-width: 200px;
  select {
    width: 100%;
  }
`
const Checkbox = styled.input`
  margin-left: 0;
  margin-right: 8px;
`

export const ConfigDialog: React.FC<{
  config: Config
  onChange(config: Config): void
  onClose(): void
}> = ({ config, onChange, onClose }) => (
  <Dialog show onClose={onClose} title="Configuration">
    <FormItem>
      <FormLabel>Word length</FormLabel>
      <FormValue>
        <input
          type="number"
          value={config.wordLength}
          onChange={e =>
            onChange({ ...config, wordLength: e.currentTarget.valueAsNumber })
          }
        />
      </FormValue>
    </FormItem>

    <FormItem>
      <FormLabel>Maximum attempt</FormLabel>
      <FormValue>
        <input
          type="number"
          value={config.maxAttempts}
          onChange={e =>
            onChange({ ...config, maxAttempts: e.currentTarget.valueAsNumber })
          }
        />
      </FormValue>
    </FormItem>
  </Dialog>
)
