

module.exports = {
  test(success) {
    console.log(success);
    // return num1 + num2 + 'helper is connected!';
    if (success.length > 0) {
      return "yes it's here";
    }
    return 'nope not here';
  },


};
