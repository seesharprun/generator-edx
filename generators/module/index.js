var generators = require('yeoman-generator');
var Path = require('path');
var Guid = require('node-uuid');
var Table = require('cli-table');


var edXBase = generators.Base.extend({
    settings: {
        moduleMetadataFile: 'module.json'
    },
    validateParam: function(input) {
        if (input && input.length > 0) {
            return true;
        } else {
            return 'You must enter a value.';
        }
    },
    getExampleName: function() {
        var prefix = 'Mod';
        for (var pointer = 0; pointer <= 99; pointer++) {
            var testFolderName = prefix + ("00" + pointer).slice(-2);
            var testFilePath = Path.join(this.destinationPath(testFolderName), this.settings.moduleMetadataFile)
            if (!this.fs.exists(testFilePath)) {
                return testFolderName;
            }
        }
        return prefix + Guid.v4();
    }
});

module.exports = edXBase.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.option('course', {
            type: String,
            required: true,
            desc: 'Creates content within an existing course.'
        });
        this.argument('module-name', {
            type: String,
            required: false,
            optional: true,
            desc: 'Name of module folder.'
        });
        this.option('module-title', {
            type: String,
            required: false,
            optional: true,
            desc: 'Title of module.'
        });
    },
    prompting: {
        logIntro: function() {
            this.log('─────────────────────');
            this.log('Creating New Module');
            this.log('─────────────────────');
        },
        queryModuleFolderName: function() {
            if (!this['module-name']) {
                var done = this.async();
                this.prompt({
                    type: 'input',
                    name: 'moduleName',
                    message: 'Module Folder Name',
                    validate: this.validateParam,
                    default: this.getExampleName()
                }, function(answers) {
                    this.settings.moduleName = answers.moduleName;
                    done();
                }.bind(this));
            } else {
                this.settings.moduleName = this['module-name'];
            }
        },
        queryModuleTitle: function() {
            if (!this.options['module-title']) {
                var done = this.async();
                this.prompt({
                    type: 'input',
                    name: 'moduleTitle',
                    message: 'Module Title',
                    validate: this.validateParam
                }, function(answers) {
                    this.settings.moduleTitle = answers.moduleTitle;
                    done();
                }.bind(this));
            } else {
                this.settings.moduleTitle = this.options['module-title'];
            }
        },
        composeModuleDirectory: function() {
            this.settings.moduleDirectory = Path.join(this.destinationPath(this.options.course), this.settings.moduleName);
            this.settings.moduleMetadataFilePath = Path.join(this.settings.moduleDirectory, this.settings.moduleMetadataFile);
        },
        logPromptResults: function() {
            var table = new Table();
            table.push({
                'Module Name': this.settings.moduleName
            }, {
                'Module Directory': this.settings.moduleDirectory
            });
            this.log(table.toString());
        }, 
        compose: function() {
            this.composeWith('edx:section', {
                options: {
                    'course': this.options.course,
                    'module': this.settings.moduleName,
                    'chapter-title': 'First Section'
                },
                args: [
                    'Sec00'
                ]
            });
        }
    },
    writing: {
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.moduleMetadataFile),
                this.destinationPath(this.settings.moduleMetadataFilePath), {
                    moduleName: this.settings.moduleName,
                    moduleTitle: this.settings.moduleTitle
                }
            );
        }
    }
});