#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
// import {withFullScreen} from 'fullscreen-ink';
import {wsServer} from './web-socket-server.js';

const cli = meow(
    `
	Usage
	  $ my-ts-inc-app

	Options
		--name  Your name

	Examples
	  $ my-ts-inc-app --name=Jane
	  Hello, Jane
`,
    {
        importMeta: import.meta,
        flags: {
            name: {
                type: 'string',
            },
        },
    },
);

async function main() {
    const {waitUntilExit} = render(<App name={cli.flags.name} />);

    wsServer.start();

    await waitUntilExit();

    // withFullScreen(<App name={cli.flags.name} />).start();
}

main();
