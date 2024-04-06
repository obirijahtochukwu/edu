export interface LoginResponse {
  token: string,
    user: {
      _id: string,
      email: string,
      firstname: string,
      lastname: string,
      picture: string,
      username: string,
      
    },
}