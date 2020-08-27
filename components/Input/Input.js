import TextField from '@material-ui/core/TextField';

export default function Input({
  label,
  value,
  handleChange,
}) {
  return (
    <TextField
      id="standard-basic"
      label={label}
      value={value}
      color="secondary"
      onChange={handleChange}
    />
  );
}
