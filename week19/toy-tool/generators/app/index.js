let Generator = require('yeoman-generator');
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }
  collecting() {
    this.log('method 1 just ran');
  }

  creating() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'toy-tools' }
    );
    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('libs/createElement.js')
    );
    this.fs.copyTpl(
      this.templatePath('gesture.js'),
      this.destinationPath('libs/gesture.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.test.js'),
      this.destinationPath('test/main.test.js')
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc')
    );
    this.fs.copyTpl(
        this.templatePath('.babelrc'),
        this.destinationPath('.babelrc')
      );
    this.npmInstall(
      [
        'webpack',
        'webpack-cli',
        'webpack-dev-server',
        '@babel/core',
        '@babel/preset-env',
        '@babel/plugin-transform-react-jsx',
        'babel-loader',
        'mocha',
        'nyc',
        '@istanbuljs/nyc-config-babel',
        'babel-plugin-istanbul',
        'html-webpack-plugin',
        '@babel/register'
      ],
      {
        'save-dev': true
      }
    );

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
};
