var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    settings: {
        configFile: 'config.json'
    },
    constructor: function() {
        generators.Base.apply(this, arguments);
    },
    writing: {
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.configFile),
                this.destinationPath(this.settings.configFile), 
                { }
            );
        }
    }
});