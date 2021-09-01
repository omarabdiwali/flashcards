import React, { useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { DeleteIcon } from '@chakra-ui/icons';
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

export default function DeleteFolder({ name, index }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  function deleteFolder() {
    fetch('/delete', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({folder: name, index: index})
    }).then(res => res.json())
      .then((data) => {
        if (data.response === `Deleted '${name}' folder!`) {
          enqueueSnackbar("Folder deleted!", { variant: "success", autoHideDuration: 3000 });
          window.location.reload();
        }
        else {
          enqueueSnackbar("Something wrong happened.", { variant: "error", autoHideDuration: 3000 });
        }
    })
  }

  return (
    <>
      <IconButton
        colorScheme="red"
        aria-label="Delete folder"
        icon={<DeleteIcon />}
        onClick={() => setIsOpen(true)}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Folder
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteFolder} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}