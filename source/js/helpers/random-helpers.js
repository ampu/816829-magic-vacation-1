export const generate = (start, end) => {
  return start + Math.random() * (end - start);
};

export const generateInteger = (min, max) => {
  return min + Math.round(Math.random() * (max - min));
};

export const generateIntegerByConstraint = ({min, max}) => generateInteger(min, max);
