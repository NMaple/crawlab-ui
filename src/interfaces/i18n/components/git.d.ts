interface LComponentsGit {
  form: {
    remoteUrl: string;
    authType: string;
    username: string;
    password: string;
    privateKey: string;
  };
  common: {
    currentBranch: string;
  };
  actions: {
    title: string;
    label: {
      pull: string;
      commit: string;
      checkout: string;
    };
    tooltip: {
      pull: string;
      commit: string;
      checkout: string;
    };
  };
  tabs: {
    remote: string;
    references: string;
    logs: string;
    changes: string;
    ignore: string;
  };
  checkout: {
    type: string;
    reference: string;
  };
  references: {
    type: {
      branch: string;
      tag: string;
    };
    table: {
      columns: {
        timestamp: string;
      };
    };
  };
  logs: {
    table: {
      columns: {
        reference: string;
        commitMessage: string;
        author: string;
        timestamp: string;
      };
    };
  };
  changes: {
    status: {
      untracked: string;
      modified: string;
      added: string;
      deleted: string;
      renamed: string;
      copied: string;
      updatedButUnmerged: string;
    };
    table: {
      columns: {
        changedFile: string;
        status: string;
      };
    };
  };
  ignore: {
    table: {
      columns: {
        file: string;
      };
    };
  };
}
