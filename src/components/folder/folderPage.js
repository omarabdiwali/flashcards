import React, { useState, useEffect } from 'react';
import { List, Heading, Spinner } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import CreateFolder from './createFolder';
import FolderItems from './folderItems';
import { Grid } from 'grommet';

export default function FolderPage() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetch('/me')
      .then(res => res.json())
      .then((data) => {
        if (data.response === "Logged In!") {
          fetch('/folders')
            .then(res => res.json())
            .then((data) => {
              setNames(data.names);
              setLoading(false);
            })
            .catch(err => console.log(err));
        }
        else {
          history.push("/");
        }
      })
      .catch(err => console.log(err));
  }, [history])

  return (
    <>
      <div style={{margin: "1%"}}>
        <CreateFolder />
      </div>
      <Heading as={"h1"} marginLeft="3%">Folders</Heading>
        <List spacing={3} paddingTop="5%">
          {!loading ? names.length > 0 ?
           <Grid gap="medium" style={{paddingLeft: "3%", paddingRight: "3%"}}>
            {names.map((name, i) => {
            return (<FolderItems name={name} i={i} key={i} />)
          })}</Grid> : <center><Heading as={"h1"}>There are no folders currently</Heading></center> : <center><Spinner size="xl" /></center>}    
        </List>
    </>
  )
}