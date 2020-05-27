const parserOpts = require('./release/parser-opts');

module.exports = {
  parserOpts,
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
          title: 'this_is_the_title',
          host: 'https://github.com',
          commitsSort: [
            'subject',
            'scope'
          ],
          owner: 'C0ZEN',
          repoUrl: 'https://github.com/C0ZEN/semantic-release-poc',
          linkReferences: true,
          commit: 'commits',
          issue: 'issues',
          includeDetails: false,
          ignoreReverted: false
        },
        linkCompare: true,
        linkReferences: true,
        commit: 'commit',
        issue: 'issues'
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
        message: 'build(release): new version ${nextRelease.version}'
      }
    ],
    [
      '@semantic-release/github'
    ]
  ],
  dryRun: false,
  ci: true,
  debug: true,
  tagFormat: '${version}'
};
