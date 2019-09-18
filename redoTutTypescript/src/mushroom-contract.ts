/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Mushroom } from './mushroom';

@Info({title: 'MushroomContract', description: 'My Smart Contract' })
export class MushroomContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async mushroomExists(ctx: Context, mushroomId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(mushroomId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createMushroom(ctx: Context, mushroomId: string, value: string): Promise<void> {
        const exists = await this.mushroomExists(ctx, mushroomId);
        if (exists) {
            throw new Error(`The mushroom ${mushroomId} already exists`);
        }
        const mushroom = new Mushroom();
        mushroom.value = value;
        const buffer = Buffer.from(JSON.stringify(mushroom));
        await ctx.stub.putState(mushroomId, buffer);
    }

    @Transaction(false)
    @Returns('Mushroom')
    public async readMushroom(ctx: Context, mushroomId: string): Promise<Mushroom> {
        const exists = await this.mushroomExists(ctx, mushroomId);
        if (!exists) {
            throw new Error(`The mushroom ${mushroomId} does not exist`);
        }
        const buffer = await ctx.stub.getState(mushroomId);
        const mushroom = JSON.parse(buffer.toString()) as Mushroom;
        return mushroom;
    }

    @Transaction()
    public async updateMushroom(ctx: Context, mushroomId: string, newValue: string): Promise<void> {
        const exists = await this.mushroomExists(ctx, mushroomId);
        if (!exists) {
            throw new Error(`The mushroom ${mushroomId} does not exist`);
        }
        const mushroom = new Mushroom();
        mushroom.value = newValue;
        const buffer = Buffer.from(JSON.stringify(mushroom));
        await ctx.stub.putState(mushroomId, buffer);
    }

    @Transaction()
    public async deleteMushroom(ctx: Context, mushroomId: string): Promise<void> {
        const exists = await this.mushroomExists(ctx, mushroomId);
        if (!exists) {
            throw new Error(`The mushroom ${mushroomId} does not exist`);
        }
        await ctx.stub.deleteState(mushroomId);
    }

}
