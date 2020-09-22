import { MenuItem, Select, withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import {
  MicrosoftXbox,
  NintendoSwitch, SonyPlaystation
} from 'mdi-material-ui';
import React, { SetStateAction } from 'react';
interface IProps {
  platform: 'playstation' | 'xbox' | 'switch';
  setPlatform: React.Dispatch<
    SetStateAction<'playstation' | 'xbox' | 'switch'>
  >;
  fullWidth?: boolean;
}
const PlatformSelect: React.FC<IProps> = ({
  platform,
  setPlatform,
  fullWidth,
}) => {
  const handleChange = (event: any) => {
    setPlatform(event.target.value);
  };
  return (
    <Select
      labelId='demo-customized-select-label'
      id='demo-customized-select'
      label='Platform'
      fullWidth={fullWidth ? true : false}
      value={platform}
      onChange={handleChange}
      defaultValue={platform}
      input={<BootstrapInput />}
    >
      <MenuItem value={'playstation'}>
        <SonyPlaystation fontSize='inherit' />
        Playstation
      </MenuItem>
      <MenuItem value={'xbox'}>
        <MicrosoftXbox fontSize='inherit' />
        Xbox
      </MenuItem>
      <MenuItem value={'switch'}>
        <NintendoSwitch fontSize='inherit' />
        Switch
      </MenuItem>
    </Select>
  );
};
export const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);
export default PlatformSelect;
