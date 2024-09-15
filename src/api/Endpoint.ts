class APIEndpoint {
  static Authentication = class {
    private static readonly PREFIX = '/auth';
    public static readonly LOGIN = this.PREFIX + '/login';
    public static readonly CURRENT_USER_INFO = this.PREFIX + '/current-userinfo';
    public static readonly CHANGE_PASSWORD = this.PREFIX + '/change-password';
  };
}

export default APIEndpoint;
