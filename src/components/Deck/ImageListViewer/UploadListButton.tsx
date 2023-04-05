import {
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { IconFileUpload } from '@tabler/icons-react';
import { useRef } from 'react';
import supabase from '../../../lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const UploadListButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return console.error('No file');

    const ext = file.name.split('.')[1];
    const fileName = uuidv4()
    const { data, error } = await supabase.storage
      .from('uploaded-deck-lists')
      .upload(`${fileName}.${ext}`, file, {
        cacheControl: '3600',
        upsert: false,
      });
  };

  return (
    <FormControl isRequired>
      {/* <FormLabel htmlFor='writeUpFile'>{''}</FormLa> */}
      <InputGroup>
        <IconFileUpload
          size={18}
          onClick={e => {
            e.stopPropagation();
            inputRef.current && inputRef.current.click();
          }}
        />
        <input
          ref={inputRef}
          type='file'
          accept={'image/png, image/jpeg, image/heic'}
          onClick={e => {
            e.stopPropagation();
          }}
          onChange={handleFileUpload}
          // name={name}
          // ref={inputRef}
          // {...inputProps}
          // inputRef={ref}
          style={{ display: 'none' }}
        ></input>
        {/* <Input
        placeholder={placeholder || "Your file ..."}
        onClick={() => inputRef.current.click()}
        value={value}
      /> */}
      </InputGroup>
    </FormControl>
  );
};
