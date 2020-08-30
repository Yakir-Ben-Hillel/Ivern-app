/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Chip, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Game } from '../../../../@types/types';
interface IGameOptions {
  options: Game[];
  setOptions: React.Dispatch<React.SetStateAction<Game[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameError: boolean;
  size?: 'small' | 'medium' | undefined;
}
const GamesOptions: React.FC<IGameOptions> = ({
  options,
  setOptions,
  open,
  setOpen,
  setGames,
  size,
  gameError,
}) => {
  const loading = open && options.length === 0;

  return (
    <Autocomplete
      multiple
      onChange={(event, games) => {
        setGames(games);
      }}
      id='size-small-outlined-multi'
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      size='medium'
      options={options}
      loading={loading}
      disableCloseOnSelect
      getOptionLabel={(option: Game) => option.name}
      renderOption={(option) => (
        <React.Fragment>
          <img
            src={'https://' + option.cover}
            style={{
              width: '45px',
              marginRight: '7px',
            }}
          />
          <Typography>{option.name}</Typography>
        </React.Fragment>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant='outlined'
            label={option.name}
            size='small'
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          error={gameError}
          helperText={gameError ? 'Please choose some games.' : ''}
          label='Search Games'
          size={size ? size : 'small'}
          variant='outlined'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
export default GamesOptions;
