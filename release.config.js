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
    '@semantic-release/release-notes-generator',
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
        message: 'build(release): new version ${nextRelease.version}'
      }
    ],
    '@semantic-release/github'
  ],
  dryRun: false,
  ci: true,
  debug: true,
  tagFormat: '${version}'
};
