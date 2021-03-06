/* @flow */

import { Core, init as initCore, initTransport } from '../../js/core/Core.js';
import { checkBrowser } from '../../js/utils/browser';
import { settings, CoreEventHandler } from './common.js';

import type {
    SubtestVerifyMessage,
    VerifyMessageSegwitNativeAvailableSubtests,
} from 'flowtype/tests';
import type {
    TestVerifyMessagePayload,
    ExpectedVerifyMessageResponse,
} from 'flowtype/tests/verify-message';

const verify = (): SubtestVerifyMessage => {
    const testPayloads: Array<TestVerifyMessagePayload> = [
        {
            // trezor pubkey - OK
            method: 'verifyMessage',
            coin: 'Bitcoin',
            address: 'bc1qyjjkmdpu7metqt5r36jf872a34syws33s82q2j',
            signature: '289e23edf0e4e47ff1dec27f32cd78c50e74ef018ee8a6adf35ae17c7a9b0dd96f48b493fd7dbab03efb6f439c6383c9523b3bbc5f1a7d158a6af90ab154e9be80',
            message: 'This is an example of a signed message.',
        },
        {
            // trezor pubkey - wrong sig
            method: 'verifyMessage',
            coin: 'Bitcoin',
            address: 'bc1qyjjkmdpu7metqt5r36jf872a34syws33s82q2j',
            signature: '289e23edf0e4e47ff1dec27f32cd78c50e74ef018ee8a6adf35ae17c7a9b0dd96f48b493fd7dbab03efb6f439c6383c9523b3bbc5f1a7d158a6af90ab154e9be00',
            message: 'This is an example of a signed message.',
        },
        {
            // trezor pubkey - wrong msg
            method: 'verifyMessage',
            coin: 'Bitcoin',
            address: 'bc1qyjjkmdpu7metqt5r36jf872a34syws33s82q2j',
            signature: '289e23edf0e4e47ff1dec27f32cd78c50e74ef018ee8a6adf35ae17c7a9b0dd96f48b493fd7dbab03efb6f439c6383c9523b3bbc5f1a7d158a6af90ab154e9be80',
            message: 'This is an example of a signed message!',
        },
    ];

    const expectedResponses: Array<ExpectedVerifyMessageResponse> = [
        { success: true },
        { success: false },
        { success: false },
    ];

    return {
        testPayloads,
        expectedResponses,
        specName: '/verify',
    };
};

const verifyLong = (): SubtestVerifyMessage => {
    const testPayloads: Array<TestVerifyMessagePayload> = [
        {
            method: 'verifyMessage',
            coin: 'Bitcoin',
            address: 'bc1qyjjkmdpu7metqt5r36jf872a34syws33s82q2j',
            signature: '285ff795c29aef7538f8b3bdb2e8add0d0722ad630a140b6aefd504a5a895cbd867cbb00981afc50edd0398211e8d7c304bb8efa461181bc0afa67ea4a720a89ed',
            message: 'VeryLongMessage!'.repeat(64),
        },
    ];

    const expectedResponses: Array<ExpectedVerifyMessageResponse> = [
        { success: true },
    ];

    return {
        testPayloads,
        expectedResponses,
        specName: '/verifyLong'
    };
};

const verifyTestnet = (): SubtestVerifyMessage => {
    const testPayloads: Array<TestVerifyMessagePayload> = [
        {
            method: 'verifyMessage',
            coin: 'Testnet',
            address: 'tb1qyjjkmdpu7metqt5r36jf872a34syws336p3n3p',
            signature: '289e23edf0e4e47ff1dec27f32cd78c50e74ef018ee8a6adf35ae17c7a9b0dd96f48b493fd7dbab03efb6f439c6383c9523b3bbc5f1a7d158a6af90ab154e9be80',
            message: 'This is an example of a signed message.',
        },
    ];

    const expectedResponses: Array<ExpectedVerifyMessageResponse> = [
        { success: true },
    ];

    return {
        testPayloads,
        expectedResponses,
        specName: '/verifyTestnet'
    };
};

export const verifyMessageSegwitNative = (): void => {
    const subtest: VerifyMessageSegwitNativeAvailableSubtests = __karma__.config.subtest;
    const availableSubtests = {
        verify,
        verifyLong,
        verifyTestnet,
    };

    describe('verifyMessageSegwitNative', () => {
        let core: Core;

        beforeEach(async (done) => {
            core = await initCore(settings);
            checkBrowser();
            done();
        });
        afterEach(() => {
            // Deinitialize existing core
            core.onBeforeUnload();
        });

        const { testPayloads, expectedResponses, specName } = availableSubtests[subtest]();
        if (testPayloads.length !== expectedResponses.length) {
            throw new Error('Different number of payloads and expected responses');
        }

        for (let i = 0; i < testPayloads.length; i++) {
            const payload = testPayloads[i];
            const expectedResponse = expectedResponses[i];

            it(specName, async (done) => {
                const handler = new CoreEventHandler(core, payload, expectedResponse, expect, done);
                handler.startListening();
                await initTransport(settings);
            });
        }
    });
};