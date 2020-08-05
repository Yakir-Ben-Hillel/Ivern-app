import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Checkbox, Typography } from '@material-ui/core';
import { Area } from '../searchBar';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
interface IProps {
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  areaError: boolean;
}
const AreaOptions: React.FC<IProps> = ({ setAreas, areaError }) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      onChange={(event, areas) => setAreas(areas)}
      options={israelAreas}
      disableCloseOnSelect
      size="small"
      groupBy={(option) => option.area}
      getOptionLabel={(option) => option.name}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          <Typography>{option.name}</Typography>
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={areaError}
          helperText={areaError ? 'Please choose some areas.' : ''}
          variant="outlined"
          label="Search Area"
        />
      )}
    />
  );
};
export const israelAreas: Area[] = [
  { name: 'תל אביב', area: 'מרכז', id: 1 },
  { name: 'ראשון לציון והסביבה', area: 'מרכז', id: 2 },
  { name: 'חולון- בת ים', area: 'מרכז', id: 3 },
  { name: 'רמת גן- גבעתיים', area: 'מרכז', id: 4 },
  { name: 'פתח תקווה והסביבה', area: 'מרכז', id: 5 },
  { name: 'ראש העין והסביבה', area: 'מרכז', id: 6 },
  { name: 'בקעת אונו', area: 'מרכז', id: 7 },
  { name: 'רמלה- לוד', area: 'מרכז', id: 8 },
  { name: 'בני ברק- גבעת שמואל', area: 'מרכז', id: 9 },
  { name: 'עמק איילון', area: 'מרכז', id: 10 },
  { name: 'שוהם והסביבה', area: 'מרכז', id: 11 },
  { name: 'מודיעין והסביבה', area: 'מרכז', id: 12 },
  { name: 'ירושלים', area: 'אזור ירושלים', id: 13 },
  { name: 'בית שמש והסביבה', area: 'אזור ירושלים', id: 14 },
  { name: 'הרי יהודה- מבשרת והסביבה', area: 'אזור ירושלים', id: 15 },
  { name: 'מעלה אדומים והסביבה', area: 'אזור ירושלים', id: 16 },
  { name: 'יהודה שומרון ובקעת הירדן', area: 'יהודה ושומרון', id: 17 },
  { name: 'ישובי דרום ההר', area: 'יהודה ושומרון', id: 18 },
  { name: 'ישובי השומרון', area: 'יהודה ושומרון', id: 19 },
  { name: 'גוש עציון', area: 'יהודה ושומרון', id: 20 },
  { name: 'בקעת הירדן וצפון ים המלח', area: 'יהודה ושומרון', id: 21 },
  { name: 'אריאל וישובי יהודה', area: 'יהודה ושומרון', id: 22 },
  { name: 'שפלה מישור חוף דרומי', area: 'השפלה', id: 23 },
  { name: 'רחובות- נס ציונה', area: 'השפלה', id: 24 },
  { name: 'אשדוד- אשקלון והסביבה', area: 'השפלה', id: 25 },
  { name: 'גדרה-יבנה והסביבה', area: 'השפלה', id: 26 },
  { name: 'קרית גת והסביבה', area: 'השפלה', id: 27 },
  { name: 'דרום', area: 'דרום', id: 28 },
  { name: 'באר שבע והסביבה', area: 'דרום', id: 29 },
  { name: 'אילת והערבה', area: 'דרום', id: 30 },
  { name: 'ישובי הנגב', area: 'דרום', id: 31 },
  { name: 'הנגב המערבי', area: 'דרום', id: 32 },
  { name: 'דרום ים המלח', area: 'דרום', id: 33 },
  { name: 'צפון', area: 'דרום', id: 34 },
  { name: 'חיפה והסביבה', area: 'דרום', id: 35 },
  { name: 'קריות והסביבה', area: 'דרום', id: 36 },
  { name: 'עכו-נהריה והסביבה', area: 'דרום', id: 37 },
  { name: 'גליל עליון', area: 'דרום', id: 38 },
  { name: 'הכנרת והסביבה', area: 'דרום', id: 39 },
  { name: 'כרמיאל והסביבה', area: 'דרום', id: 40 },
  { name: 'נצרת-שפרעם והסביבה', area: 'דרום', id: 41 },
  { name: 'ראש פינה החולה', area: 'דרום', id: 42 },
  { name: 'גליל תחתון', area: 'דרום', id: 43 },
  { name: 'זכרון וחוף הכרמל', area: 'חדרה זכרון והעמקים', id: 44 },
  { name: 'חדרה והסביבה', area: 'חדרה זכרון והעמקים', id: 45 },
  { name: 'קיסריה והסביבה', area: 'חדרה זכרון והעמקים', id: 46 },
  { name: 'עמק בית שאן', area: 'חדרה זכרון והעמקים', id: 47 },
  { name: 'עפולה והעמקים', area: 'חדרה זכרון והעמקים', id: 48 },
  { name: 'רמת מנשה', area: 'חדרה זכרון והעמקים', id: 49 },
  { name: 'השרון', area: 'השרון', id: 50 },
  { name: 'נתניה והסביבה', area: 'השרון', id: 51 },
  { name: 'רמת השרון-הרצליה', area: 'השרון', id: 52 },
  { name: 'רעננה-כפר סבא', area: 'השרון', id: 53 },
  { name: 'הוד השרון והסביבה', area: 'השרון', id: 54 },
  { name: 'דרום השרון', area: 'השרון', id: 55 },
  { name: 'צפון השרון', area: 'השרון', id: 56 },
];

export default AreaOptions;
