import { AlertDialog, Button, Center, Text } from 'native-base'
import React from 'react'

interface IAppDialog {
  open: boolean
  title: string
  message: string
  onClose(): void
  onAccept(): void
}

const AppDialog = ({
  open,
  title,
  message,
  onClose,
  onAccept,
}: IAppDialog) => {

  return (
    <Center w="50%">
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        motionPreset="fade"
        isCentered
      >
        <AlertDialog.Content w="50%">
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialog.Header>
          <AlertDialog.Body>
            {message}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button onPress={onClose} colorScheme="rose" color="#fff">
              <Text>Cancel</Text>
            </Button>
            <Button colorScheme="emerald" onPress={onAccept} ml={3}>
              Accept
        </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog >
    </Center>
  )
}

export default AppDialog