# NPM Package Management
## In short
run
```shell
npm ci
```
Explanation you can find below

### Problem with `npm install` ?

>`npm install` honors `package-lock.json` only if it satisfies the requirements of `package.json`.
> If it doesn't satisfy those requirements, packages are updated & `package-lock` is overwritten.
> If you want the install to fail instead of overwriting package-lock when this happens, use `npm ci`.


* You declare a dependency in `package.json` like:

```shell
"depA": "^1.0.0"
```
* Then you do, `npm install` which will generate a `package-lock.json` with:

```shell
"depA": "1.0.0"
```
* Few days later, a newer minor version of "depA" is released, say "1.1.0", then the following holds true:

```shell
npm ci       # respects only package-lock.json and installs 1.0.0

npm install  # also, respects the package-lock version and keeps 1.0.0 installed 
             # (i.e. when package-lock.json exists, it overrules package.json)
```
Next, you manually update your package.json to:

```shell
"depA": "^1.1.0"
```
Then rerun:

```shell
npm ci      # will try to honor package-lock which says 1.0.0
            # but that does not satisfy package.json requirement of "^1.1.0" 
            # so it would throw an error 

npm install # installs "1.1.0" (as required by the updated package.json)
            # also rewrites package-lock.json version to "1.1.0"
            # (i.e. when package.json is modified, it overrules the package-lock.json)
```

## What is solution ?
Probably you should use something like this
```shell
npm ci
```
Instead of using npm install if you don't want to change the version of your package.
According to the official [documentation](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable), both npm install and npm ci install the dependencies which are needed for the project.
> The main difference is, `npm install` does install the packages taking `package.json` as a reference.
> Where in the case of `npm ci`, it does install the packages taking `package-lock.json` as a reference,
> making sure every time the exact package is installed.


## [Fixing Package manually](https://stackoverflow.com/a/53506971/637377)