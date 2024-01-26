
import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from './general-utils/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200'
    });
  }

  public async checkConnection(): Promise<void> {
      log.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        log.info(`GatewayService ElasticSearch health status - ${health.status}`);
      } catch (error:any) {
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.error(`Error details: ${error.message}`);;
      }
    }
}


export const elasticSearch: ElasticSearch = new ElasticSearch();