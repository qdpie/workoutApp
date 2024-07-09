
# Git/Github

All steps can be completed directly in the command line or through vs code source control

### SSH setup

Follow github's steps on ssh setup
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

### Clone repo

If you are doing this for the first time:

- setup local/global config for username/email
- clone github repo git@github.com:jpe0824/workoutApp.git

```sh
# Set up global config
git config --global user.name "Username"
git config --global user.email "your-email@example.com"
# Clone the repository
git clone git@github.com:jpe0824/workoutApp.git
```

### Create branch

- Create branch (use your name)

```sh
# Create a new branch and switch to it
git checkout -b your-branch-name
```

- Edit something at the bottom of this file
- Commit and push to your branch

```sh
#Add all changes to staging
git add .

#Commit the changes
git commit -m "Your commit message"

#Push the changes to your branch
git push origin your-branch-name
```

### Merging

- Merge main into your branch (watch for any merge conflicts)

```sh
#Switch to the main branch
git checkout main

#Pull the latest changes
git pull

#Switch back to your branch
git checkout your-branch-name

#Merge main into your branch
git merge main
```

### Pull request

- Merge back into main by creating a pull request.
- Request at least one person to review the pull request.
- Once approved (try to review and approve someone elses to) complete merge into Main branch

Here are some simple steps to create a pull request on GitHub:

1. **Push your branch to the GitHub repository**: Use the command `git push origin your-branch-name` to push your branch to the GitHub repository.

2. **Navigate to your repository on GitHub**: Open your web browser and go to your repository on GitHub.

3. **Go to the 'Pull requests' tab**: This tab is located at the top of the repository page.

4. **Click on 'New pull request'**: This button is usually located at the top right of the 'Pull requests' tab.

5. **Choose the correct branches for the pull request**: In the 'base' dropdown, choose the branch that you want to merge your changes into (usually `main` or `master`). In the 'compare' dropdown, choose the branch that contains the changes you want to merge (the branch you've been working on).

6. **Review your changes**: GitHub will show you a diff of the changes between the two branches. Make sure everything looks correct.

7. **Click on 'Create pull request'**: This will take you to a new page where you can add a title and a description for your pull request. Try to be descriptive to help the reviewers understand your changes.

8. **Submit the pull request**: Click on 'Create pull request' again to submit the pull request.

**RYAN WAS HERE**
**Q WAS HERE**