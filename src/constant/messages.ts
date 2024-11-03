export const Message = {
    passwordShouldStrong:
      'Use at least 8 or more characters with a combination of letters, uppercase letters, numbers, and symbols',
    passwordShouldMatch: 'Both passwords must be the same',
    validPhoneNumber: 'The phone number must be valid',
    notFound: 'Not found',
    invalidCredentials: 'Invalid credentials',
    loginSuccessfully: 'Logged in',
    invalidOldPassword: 'Invalid old password',
    idIsRequired: 'ID is required',
    passwordReset: 'Your password has been reset',
    updated: 'Updated',
    deleted: 'Deleted',
    created: 'Created',
    error: 'An error occurred',
    notAuthorized: 'You are not authorized to access this resource',
    tokenExpire: 'Token expired, please log in again',
    fetched: 'Fetched',
    pleaseSelectLevel: 'Please select a level',
    isBlocked: 'This account has been blocked',
    isUnBlocked: 'This account has been unblocked',
    logoutSuccessfully: 'Logged out',
    alreadyExist: 'Already exists',
    alreadyPublished: 'Already published',
    emailSent: 'We have sent a code to your email',
    otpExpired: 'OTP has expired',
    invalidOTP: 'Invalid OTP',
    validOTP: 'Valid OTP',
    forbidden: 'Forbidden',
  }
  
  export const getNotFoundMessage = (title: string) => {
    return `${title} Not Found`
  }
  export const deletedMessage = (title: string) => {
    return `${title} deleted successfully`
  }
  export const UpdatedMessage = (title: string) => {
    return `${title} updated successfully`
  }
  export const CreatedMessage = (title: string) => {
    return `${title} created successfully`
  }
  