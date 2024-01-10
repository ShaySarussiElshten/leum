import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public CLIENT_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
  }
}

export const config: Config = new Config();