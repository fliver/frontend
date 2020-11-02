import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useField } from 'formik';

const CustomCheckbox = (props) => {
  const [field] = useField({
    name: props.name,
    value: props.value,
    type: 'checkbox',
  });

  return (
    <FormControlLabel
      control={<Checkbox color="primary" {...field} {...props} />}
      label={props.label}
    />
  );
};

export default CustomCheckbox;
