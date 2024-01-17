describe('API Tests', () => {
  it('GET - retrieve all messages', () => {
    cy.request('GET', 'http://localhost:4000/api/v1/message').then((response) => {
      expect(response.status).to.eq(200);
      //expect(response.body).to.be.an('array');
      // Additional assertions...
    });
  });

  // it('POST - create a new message', () => {
  //   const newMessage = {
  //     name: 'John Doe',
  //     age: 30,
  //     content: 'Hello, World!'
  //   };

  //   cy.request('POST', 'http://localhost:4000/api/v1/message', newMessage).then((response) => {
  //     expect(response.status).to.eq(200);
  //     expect(response.body).to.have.property('id');
  //     // Additional assertions...
  //   });
  // });

  // More tests for other operations...
});
