import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from './general-utils/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client | any;

  constructor() {
    if(config.IS_ELASTIC_CONFIGURED){
      this.elasticSearchClient = new Client({
        node: config.ELASTIC_SEARCH_URL
      });
    }
  }

  public async checkConnection(): Promise<void> {
      log.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        log.info(`GatewayService ElasticSearch health status - ${health.status}`);
        log.info(`GatewayService ElasticSearch health status - ${config.IS_ELASTIC_CONFIGURED}`);
      } catch (error:any) {
        log.info(`GatewayService ElasticSearch health status - ${config.IS_ELASTIC_CONFIGURED}`);
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.error(`Error details: ${error.message}`);;
      }
    }
}


export const elasticSearch: ElasticSearch = new ElasticSearch();