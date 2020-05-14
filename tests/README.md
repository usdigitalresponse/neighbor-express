# How to Test

`npm run test` will run all the tests locally. You may need to `npm install` first.

All tests also run in a git hook on every `git push` of every branch and the results show up as comments on the pull request.

If you make an intentional change to a component, but don't update the snapshots to reflect that intentional change, the snapshot tests will probably fail! To fix that, run 

`npm run test -- -u`

which will regenerate the snapshots. (Make sure you only do this when you know the feature is working, or the test will be guaranteeing the incorrect behavior!). Updated snapshots should be checked into git and reviewed like all other code.

