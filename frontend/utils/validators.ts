class Validators {
  /// TODO - add validators for all form types
  // add email validator that can be called on input field for email
  static emailValidator(email: string): boolean {
    // Regular expression for email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }
}

export default Validators;