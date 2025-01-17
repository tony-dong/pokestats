import {
  IconButton,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import * as ReactDOM from 'react-dom';
import { IconCards } from '@tabler/icons-react';
import { Standing, Tournament } from '../../../../types/tournament';
import { ListViewerModal } from './ListViewerModal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ListViewerOpenButtonProps {
  result: Standing;
  tournament: Tournament;
}

export const ListViewerOpenButton = (props: ListViewerOpenButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='view-list'
        variant={'unstyled'}
        onClick={e => {
          e.stopPropagation();
          onOpen();
        }}
        minWidth={0}
      >
        <IconCards size={20} />
      </IconButton>
      {isOpen && (
        <ListViewerModal
          isOpen={isOpen}
          onClose={onClose}
          result={props.result}
          tournament={props.tournament}
        />
      )}
    </>
  );
};
