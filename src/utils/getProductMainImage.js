export default function getProductMainImage(product) {
  const group = product.imageGroup.filter(
    (imgGroup) => imgGroup.id === product.vars[0].imageGroupId,
  );
  return group[0].images[0];
}
