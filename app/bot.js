'use strict';

import Botkit from 'botkit';
import Path from 'path';
import fs from 'fs';

export default class Bot {

  constructor() {
    if (!process.env.TOKEN) {
      console.error('Error: Specify TOKEN in environment');
      process.exit(1);
    }
  }

  run() {
    this.controller = Botkit.slackbot({
      debug: false
    });

    // connect the bot to a stream of messages
    this.controller.spawn({
      token: process.env.TOKEN
    }).startRTM();

    // import skill modules
    const path = Path.join(__dirname, 'skills');
    fs.readdirSync(path).forEach(file => {
      const tmpClass = require(`./skills/${file}`).default;
      const skill = new tmpClass(this.controller);
      if (typeof skill.bind === 'function') skill.bind();
    });
  }
}
