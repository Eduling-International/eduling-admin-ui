type JwtClaims = {
  id: string;
  sub: string;
  role: string;
  iss: string;
  iat: number;
  exp: number;
  lcp: number;
};

export default JwtClaims;
