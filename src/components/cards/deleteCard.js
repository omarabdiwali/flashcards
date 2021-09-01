import React, { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Button
} from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';
import { useSnackbar } from 'notistack';

export default function DeleteCard({ folder, card }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  function deleteCard() {
    fetch('/delete/card', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({folder: folder, index: card})
    }).then(res => res.json())
    .then(data => {
      if (data.response === "Card has been deleted!") {
        enqueueSnackbar("Card has been deleted", {variant: "success", autoHideDuration: 3000});
        window.location.reload();
      }
      else {
        enqueueSnackbar("Something went wrong.", {variant: "error", autoHideDuration: 3000});
      }
    })
  }

  return (
    <div style={{float: "right"}}>
      <IconButton colorScheme="white" fontSize="20px" icon={<DeleteIcon />} onClick={() => setIsOpen(true)} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Card
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteCard} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
  
}