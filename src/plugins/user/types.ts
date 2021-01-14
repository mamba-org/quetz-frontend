export type APIKeyInfo = {
  description: string;
  roles: Role[];
};

export type Role = {
  channel: string;
  package: string;
  role: string;
};

export type APIKey = {
  description: string;
  roles: Role[];
  key: string;
};
