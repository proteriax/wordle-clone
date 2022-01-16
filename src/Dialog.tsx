import styled from "@emotion/styled"
import { useCallback, useEffect } from "react"

const ModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(1px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`
const ModalBackground2 = styled.div`
  z-index: 2;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
`
const ModalContainer = styled.div`
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border-radius: 5px;
  margin: 0 auto;
`
const ModalTitle = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 10px 20px;
  font-weight: 600;
  text-align: center;
`
const ModalContent = styled.div`
  padding: 15px 20px;
`

export const Dialog: React.FC<{
  show: boolean
  title: string
  maxWidth?: number
  onClose(): void
}> = ({ show, children, title, maxWidth = 700, onClose }) => {
  const onBackgroundClick = useCallback(
    e => {
      if (e.currentTarget === e.target) {
        e.stopPropagation()
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    const keyup = (e: KeyboardEvent) => {
      if (show && ["Escape"].includes(e.key)) {
        e.preventDefault()
        onClose()
      }
    }
    document.body.addEventListener("keyup", keyup)
    return () => {
      document.body.removeEventListener("keyup", keyup)
    }
  }, [show, onClose])

  if (!show) {
    return null
  }

  return (
    <>
      <ModalBackground />
      <ModalBackground2 onClick={onBackgroundClick}>
        <ModalContainer style={{ maxWidth }}>
          <ModalTitle>{title}</ModalTitle>
          <ModalContent>{children}</ModalContent>
        </ModalContainer>
      </ModalBackground2>
    </>
  )
}
