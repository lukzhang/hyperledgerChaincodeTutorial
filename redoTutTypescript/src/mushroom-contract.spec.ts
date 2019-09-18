/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { MushroomContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('MushroomContract', () => {

    let contract: MushroomContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new MushroomContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"mushroom 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"mushroom 1002 value"}'));
    });

    describe('#mushroomExists', () => {

        it('should return true for a mushroom', async () => {
            await contract.mushroomExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a mushroom that does not exist', async () => {
            await contract.mushroomExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMushroom', () => {

        it('should create a mushroom', async () => {
            await contract.createMushroom(ctx, '1003', 'mushroom 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"mushroom 1003 value"}'));
        });

        it('should throw an error for a mushroom that already exists', async () => {
            await contract.createMushroom(ctx, '1001', 'myvalue').should.be.rejectedWith(/The mushroom 1001 already exists/);
        });

    });

    describe('#readMushroom', () => {

        it('should return a mushroom', async () => {
            await contract.readMushroom(ctx, '1001').should.eventually.deep.equal({ value: 'mushroom 1001 value' });
        });

        it('should throw an error for a mushroom that does not exist', async () => {
            await contract.readMushroom(ctx, '1003').should.be.rejectedWith(/The mushroom 1003 does not exist/);
        });

    });

    describe('#updateMushroom', () => {

        it('should update a mushroom', async () => {
            await contract.updateMushroom(ctx, '1001', 'mushroom 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"mushroom 1001 new value"}'));
        });

        it('should throw an error for a mushroom that does not exist', async () => {
            await contract.updateMushroom(ctx, '1003', 'mushroom 1003 new value').should.be.rejectedWith(/The mushroom 1003 does not exist/);
        });

    });

    describe('#deleteMushroom', () => {

        it('should delete a mushroom', async () => {
            await contract.deleteMushroom(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a mushroom that does not exist', async () => {
            await contract.deleteMushroom(ctx, '1003').should.be.rejectedWith(/The mushroom 1003 does not exist/);
        });

    });

});
