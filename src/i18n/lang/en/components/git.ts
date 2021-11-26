const git: LComponentsGit = {
  form: {
    remoteUrl: 'Remote URL',
    authType: 'Auth Type',
    username: 'Username',
    password: 'Password',
    privateKey: 'Private Key',
  },
  common: {
    currentBranch: 'Current Branch',
  },
  actions: {
    title: 'Git Actions',
    label: {
      pull: 'Pull',
      commit: 'Commit',
      checkout: 'Checkout',
    },
    tooltip: {
      pull: 'Pull',
      commit: 'Commit and Push',
      checkout: 'Checkout',
    },
  },
  tabs: {
    remote: 'Remote',
    references: 'References',
    logs: 'Logs',
    changes: 'Changes',
    ignore: 'Ignore',
  },
  checkout: {
    type: 'Type',
    reference: 'Reference',
  },
  references: {
    type: {
      branch: 'Branch',
      tag: 'Tag',
    },
    table: {
      columns: {
        timestamp: 'Timestamp',
      }
    }
  },
  logs: {
    table: {
      columns: {
        reference: 'Reference',
        commitMessage: 'Commit Message',
        author: 'Author',
        timestamp: 'Timestamp',
      }
    }
  },
  changes: {
    status: {
      untracked: 'Untracked',
      modified: 'Modified',
      added: 'Added',
      deleted: 'Deleted',
      renamed: 'Renamed',
      copied: 'Copied',
      updatedButUnmerged: 'Updated but Unmerged',
    },
    table: {
      columns: {
        changedFile: 'Changed File',
        status: 'Status',
      }
    }
  },
  ignore: {
    table: {
      columns: {
        file: 'File',
      }
    }
  }
};

export default git;
