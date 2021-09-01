import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Grommet,
  Text,
} from 'grommet';
import { useHistory } from 'react-router-dom';
import UpdateFolder from './updateFolder';
import DeleteFolder from './deleteFolder';

const theme = {
  themeMode: 'dark',
  global: {
    font: {
      family: `-apple-system,
           BlinkMacSystemFont, 
           "Segoe UI"`,
    },
  },
  card: {
    container: {
      background: '#FFFFFF12',
      elevation: 'none',
    },
    footer: {
      pad: { horizontal: 'medium', vertical: 'small' },
      background: '#FFFFFF06',
    },
  },
};

const Identifier = ({ children, title, subTitle, size, ...rest }) => (
  <Box gap="small" align="center" direction="row" pad="small" {...rest}>
    {children}
    <Box>
      <Text size={size} weight="bold">
        {title}
      </Text>
      <Text size={size}>{subTitle}</Text>
    </Box>
  </Box>
);

export default function FolderItems({ name, i }) {
  const linkName = encodeURIComponent(name.folder);
  const date = name.date.toString().substring(0, 10);
  const history = useHistory();

  return (
    <Grommet theme={theme}>
      <Card>
        <CardBody pad="small" onClick={() => {
          history.push(`/folder/${linkName}+${i}`);
        }}>
          <Identifier
            title={name.folder}
            subTitle={`Number of Cards: ${name.cards.length} - Created On: ${date}`}
            size="small"
          >
          </Identifier>
        </CardBody>
        <CardFooter pad={{ horizontal: 'medium', vertical: 'small' }}>
          <DeleteFolder name={name.folder} index={i} />
          <UpdateFolder name={name.folder} index={i} />
        </CardFooter>
      </Card>
    </Grommet>
  )
}