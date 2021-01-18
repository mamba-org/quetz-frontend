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

export type Channel = {
  name: string;
  role: string;
};

export type Package = {
  name: string;
  channel_name: string;
  role: string;
};
