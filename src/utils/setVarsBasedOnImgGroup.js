export default function setVarsBasedOnImgGroup(singleProduct) {
  return singleProduct.vars.filter(
    (itemVar) => itemVar.imageGroupId.toString() === singleProduct.imageGroup[0].id,
  );
}
