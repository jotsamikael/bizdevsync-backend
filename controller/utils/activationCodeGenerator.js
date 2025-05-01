exports.generateActivationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // e.g. "4567"
  };
  