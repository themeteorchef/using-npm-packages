import { Meteor } from 'meteor/meteor';
import GitHubAPI from 'github';
import chalk from 'chalk';

const moment = require('moment');

const github = new GitHubAPI();
const { clientId, secret } = Meteor.settings.private.github;

github.authenticate({
  type: 'oauth',
  key: clientId,
  secret,
});

chalk.enabled = true;

Meteor.methods({
  fetchBaseIssues() {
    github.issues.getForRepo({
      owner: 'themeteorchef',
      repo: 'base',
      state: 'open',
    })
    .then((issues) => {
      issues.forEach(({ title, number, labels, created_at }) => {
        const label = labels[0] ? labels[0].name : null;
        const labelColor = {
          feature: 'green',
          bug: 'red',
          refactor: 'yellow',
          question: 'magenta',
          documentation: 'cyan',
        }[label];

        const header = `${label ? `[${label}] ` : ''}#${number} - ${title}`;
        const coloredHeader = chalk[labelColor] ? chalk[labelColor](header) : header;

        console.log(`\n${moment(created_at).format('MMMM Do, YYYY')}`);
        console.log(coloredHeader);
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  },
});
