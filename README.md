[![Build Status](https://travis-ci.org/sleistner/stryker-lab-runner.svg?branch=master)](https://travis-ci.org/sleistner/stryker-lab-runner)
[![Gitter](https://badges.gitter.im/stryker-mutator/stryker.svg)](https://gitter.im/stryker-mutator/stryker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

![Stryker](https://github.com/stryker-mutator/stryker/raw/master/stryker-80x80.png)

# Stryker Lab Runner
A plugin to use the [Lab](https://github.com/hapijs/lab) test runner in [Stryker](http://stryker-mutator.github.io), the JavaScript mutation testing framework.

## Install

Install stryker-lab-runner locally within your project folder:

```bash
npm i --save-dev stryker-lab-runner
```

### Load the plugin

In order to use the `stryker-lab-runner` it must be loaded in the Stryker mutation testing framework via the Stryker configuration.
The easiest way to achieve this, is *not have a `plugins` section* in your config file. That way, all `node_modules` starting with `stryker-` will be loaded.

### Use the test runner

In order to use Lab as the test runner, you simply specify it in your config file:

```js
module.exports = (config) => {
    config.set({
        testRunner: 'lab',
        labOptions: {
            files: ['test/**/*.js']
        },
        reporter: [
            'progress',
            'clear-text',
            'dots',
            'html',
            'event-recorder'
        ],
        coverageAnalysis: 'off',
        mutate: ['lib/**/*.js']
    });
};
```

# Contributors

[Steffen Leistner](https://github.com/sleistner)

# License

MIT
