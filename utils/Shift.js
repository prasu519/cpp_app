const shift = (time) => {
  if (time >= 6 && time < 15) {
    return "A";
  } else if (time >= 15 && time < 23) {
    return "B";
  } else return "C";
};

export default shift;
