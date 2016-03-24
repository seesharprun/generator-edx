var generators = require('yeoman-generator');
var Path = require('path');
var Table = require('cli-table');
var Validator = require('jsonschema').Validator;

module.exports = generators.Base.extend({
    settings: {
        courseMetadataFile: 'course.json'
    },
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.argument('config-file', {
            type: String,
            required: true,
            desc: 'Config file filename.'
        });
    },
    initializing: {
        parse: function() {
            var filePath = this.destinationPath(this['config-file']);
            if (this.fs.exists(filePath)) {
                this.configuration = this.fs.readJSON(filePath);
            }
            else {
                throw Error('Configuration file not found.');
            }
        },
        validate: function() {
            var validator = new Validator();
            var schema = this.fs.readJSON(this.templatePath('schema.json'));
            var errors = validator.validate(this.configuration, schema).errors;
            if (errors.length > 0)
            {
                throw Error('Configuration file JSON validation has failed. JSON Validation Error Messages are printed below:\n' + errors.join('\n'));
            }
        },
        compose: function () {
            this.composeWith('edx:auto-modules', {
                options: {
                    'configuration': this.configuration
                }
            });
        }
    },
    writing: {
        build: function() {
            this.settings.courseMetadataFilePath = Path.join(this.destinationPath(this.configuration.name), this.settings.courseMetadataFile);
        },
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.courseMetadataFile),
                this.destinationPath(this.settings.courseMetadataFilePath), {
                    courseName: this.configuration.name,
                    courseTitle: this.configuration.title
                }
            );
            
        }
    }
});