export const squashTorusGeometry = (geometry, height, isSmooth, epsilon = 0.001) => {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const z = position.getZ(i);
    if (isSmooth) {
      if (Math.abs(z) > height / 2) {
        position.setZ(i, Math.sign(z) * height / 2);
      }
    } else {
      if (Math.abs(z) > epsilon) {
        position.setZ(i, Math.sign(z) * height / 2);
      }
    }
  }
  geometry.computeVertexNormals();
  return geometry;
};
