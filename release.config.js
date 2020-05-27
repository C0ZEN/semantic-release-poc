parserOpts = {
  mergePattern: /^Merge pull request #(\d+) from (.*)$/,
  mergeCorrespondence: [
    'id',
    'source'
  ]
};

releaseRules = [
  {
    type: 'refactor',
    release: 'patch'
  }
];

// Copied from https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/writer-opts.js#L27
// and modified to support adding all commit types to the release notes
customTransform = (commit, context) => {
  const issues = [];

  commit.notes.forEach(note => {
    note.title = `BREAKING CHANGES`;
  });

  if (commit.type === `feat`) {
    commit.type = `Features`;
  } else if (commit.type === `fix`) {
    commit.type = `Bug Fixes`;
  } else if (commit.type === `perf`) {
    commit.type = `Performance Improvements`;
  } else if (commit.type === `revert`) {
    commit.type = `Reverts`;
  } else if (commit.type === `docs`) {
    commit.type = `Documentation`;
  } else if (commit.type === `style`) {
    commit.type = `Styles`;
  } else if (commit.type === `refactor`) {
    commit.type = `Code Refactoring`;
  } else if (commit.type === `test`) {
    commit.type = `Tests`;
  } else if (commit.type === `build`) {
    commit.type = `Build System`;
  } else if (commit.type === `ci`) {
    commit.type = `Continuous Integration`;
  } else {
    return;
  }

  if (commit.scope === `*`) {
    commit.scope = ``;
  }

  if (typeof commit.hash === `string`) {
    commit.shortHash = commit.hash.substring(0, 7);
  }

  if (typeof commit.subject === `string`) {
    let url = context.repository
      ? `${context.host}/${context.owner}/${context.repository}`
      : context.repoUrl;
    if (url) {
      url = `${url}/issues/`;
      // Issue URLs.
      commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
        issues.push(issue);
        return `[#${issue}](${url}${issue})`;
      });
    }
    if (context.host) {
      // User URLs.
      commit.subject = commit.subject.replace(
        /\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g,
        (_, username) => {
          if (username.includes('/')) {
            return `@${username}`;
          }

          return `[@${username}](${context.host}/${username})`;
        }
      );
    }
  }

  // remove references that already appear in the subject
  commit.references = commit.references.filter(reference => {
    if (issues.indexOf(reference.issue) === -1) {
      return true;
    }

    return false;
  });

  return commit;
};

module.exports = {
  branches: [
    'master'
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
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
        preset: 'angular',
        parserOpts: {
          'noteKeywords': [
            'BREAKING CHANGE',
            'BREAKING CHANGES',
            'BREAKING'
          ]
        },
        'writerOpts': {
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
  preset: 'angular',
  debug: true,
  tagFormat: '${version}'
};
