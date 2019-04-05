import { expect } from 'chai';
import { Server } from '../src/server';

describe('Server', () => {

    it('should have port value set to 3000', () => {

        let server = new Server(3000);
        expect(server.port).to.equal(3000);
    });

    it('should have port value set to 5000', () => {

        let server = new Server(5000);
        expect(server.port).to.equal(5000);
    });
});