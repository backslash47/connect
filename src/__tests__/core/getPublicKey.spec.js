/* @flow */

import { Core, init as initCore, initTransport } from '../../js/core/Core.js';
import { checkBrowser } from '../../js/utils/browser';
import { settings, CoreEventHandler } from './common.js';

import type {
    TestGetPublicKeyPayload,
    ExpectedGetPublicKeyResponse,
} from 'flowtype/tests/get-public-key';

export const getPublicKey = (): void => {
    describe('GetPublicKey', () => {
        let core: Core;

        const testPayloads: Array<TestGetPublicKeyPayload> = [
            {
                method: 'getPublicKey',
                coin: 'btc',
                path: [],
            },
            {
                method: 'getPublicKey',
                coin: 'btc',
                path: [1],
            },
            {
                method: 'getPublicKey',
                coin: 'btc',
                path: [-9, 0],
            },
            {
                method: 'getPublicKey',
                coin: 'btc',
                path: [0, 9999999],
            },
        ];
        const expectedResponses: Array<ExpectedGetPublicKeyResponse> = [
            {
                payload: {
                    xpub: 'xpub661MyMwAqRbcF1zGijBb2K6x9YiJPh58xpcCeLvTxMX6spkY3PcpJ4ABcCyWfskq5DDxM3e6Ez5ePCqG5bnPUXR4wL8TZWyoDaUdiWW7bKy',
                },
            },
            {
                payload: {
                    xpub: 'xpub68zNxjsTrV8y9AadThLW7dTAqEpZ7xBLFSyJ3X9pjTv6Njg6kxgjXJkzxq8u3ttnjBw1jupQHMP3gpGZzZqd1eh5S4GjkaMhPR18vMyUi8N',
                },
            },
            {
                payload: {
                    xpub: 'xpub6A2h5mzLDfYginoD7q7wCWbq18wTbN9gducRr2w5NRTwdLeoT3cJSwefFqW7uXTpVFGtpUyDMBNYs3DNvvXx6NPjF9YEbUQrtxFSWnPtVrv',
                },
            },
            {
                payload: {
                    xpub: 'xpub6A3FoZqQEK6iwLZ4HFkqSo5fb35BH4bpjC4SPZ63prfLdGYPwYxEuC6o91bUvFFdMzKWe5rs3axHRUjxJaSvBnKKFtnfLwDACRxPxabsv2r',
                },
            },
        ];

        beforeEach(async (done) => {
            core = await initCore(settings);
            checkBrowser();
            done();
        });
        afterEach(() => {
            // Deinitialize existing core
            core.onBeforeUnload();
        });

        if (testPayloads.length !== expectedResponses.length) {
            throw new Error('Different number of payloads and expected responses');
        }

        for (let i = 0; i < testPayloads.length; i++) {
            const payload = testPayloads[i];
            const expectedResponse = expectedResponses[i];

            it(`for derivation path: "[${payload.path.toString()}]"`, async (done) => {
                const handler = new CoreEventHandler(core, payload, expectedResponse, expect, done);
                handler.startListening();
                await initTransport(settings);
            });
        }
    });
};
