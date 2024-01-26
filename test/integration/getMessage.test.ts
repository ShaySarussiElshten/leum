import axios from 'axios';
import nock from 'nock';

describe('HTTP Requests', () => {
  it('should make a GET request to an external service', async () => {
    nock('http://localhost:4000')
      .get('/api/v1/message')
      .reply(200, { success: true });

    const response = await axios.get('http://localhost:4000/api/v1/message');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true });
  });
});