const editArray = () => {
  const handleMoveBack = (images, idx) => {
    const arrayToEdit = [...images];
    const itemToUp = arrayToEdit[idx];
    const itemToDown = arrayToEdit[idx - 1];

    arrayToEdit[idx] = itemToDown;
    arrayToEdit[idx - 1] = itemToUp;
    return arrayToEdit;
  };

  const handleMoveNext = (images, idx) => {
    const arrayToEdit = [...images];
    const itemToUp = arrayToEdit[idx + 1];
    const itemToDown = arrayToEdit[idx];

    arrayToEdit[idx] = itemToUp;
    arrayToEdit[idx + 1] = itemToDown;
    return arrayToEdit;
  };

  const handleItemRemove = (images, idx) => {
    const arrayToEdit = [...images];
    arrayToEdit.splice(idx, 1);

    return arrayToEdit;
  };

  return {
    handleMoveBack,
    handleMoveNext,
    handleItemRemove,
  };
};

export default editArray;
