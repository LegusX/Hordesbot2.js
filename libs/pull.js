//taken from this stack overflow answer: https://stackoverflow.com/questions/20955393/nodegit-libgit2-for-node-js-how-to-push-and-pull
var Git = require('nodegit');
var open = Git.Repository.open;

module.exports = function (repositoryPath, remoteName, branch, cb) {
    var repository;
    var remoteBranch = remoteName + '/' + branch;
    open(repositoryPath)
        .then(function (_repository) {
            repository = _repository;
            return repository.fetch(remoteName);
        }, cb)
        .then(function () {
            return repository.mergeBranches(branch, remoteBranch);
        }, cb)
        .then(function (oid) {
            cb(null, oid);
        }, cb);
};