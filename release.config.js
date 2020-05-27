const parserOpts = require('./release/parser-opts');
const writerOpts = require('./release/writer-opts');

module.exports = {
  parserOpts,
  writerOpts,
  branches: [
    'master'
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          {
            type: 'feat',
            release: 'minor'
          },
          {
            type: 'fix',
            release: 'patch'
          },
          {
            type: 'perf',
            release: 'patch'
          }
        ],
        parserOpts: {
          noteKeywords: [
            'BREAKING CHANGE',
            'BREAKING CHANGES',
            'BREAKING'
          ]
        }
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts: {
          noteKeywords: [
            'BREAKING CHANGE',
            'BREAKING CHANGES',
            'BREAKING'
          ]
        },
        writerOpts: {
          host: 'https://github.com',
          commitsSort: [
            'subject',
            'scope'
          ],
          owner: 'C0ZEN',
          repoUrl: 'https://github.com/C0ZEN/semantic-release-poc'
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# Semantic Versioning Changelog'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'package.json',
          'package-lock.json',
          'CHANGELOG.md'
        ],
        message: 'build(release): new test version ${nextRelease.version}'
      }
    ],
    '@semantic-release/github'
  ],
  dryRun: false,
  ci: true,
  debug: true,
  tagFormat: '${version}'
};
