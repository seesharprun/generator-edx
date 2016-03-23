var generators = require('yeoman-generator');
var Path = require('path');
var Guid = require('node-uuid');
var Table = require('cli-table');


var edXBase = generators.Base.extend({
    settings: {
        sectionMetadataFile: 'section.json'        
    },
    getExampleName: function() {
        var prefix = 'Sec';
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
            desc: 'Select an existing course.',
            hide: true
        });
        this.option('module', {
            type: String,
            required: true,
            desc: 'Selects an existing module.',
            hide: true
        });
        this.argument('section-name', {
            type: String,
            required: false,
            optional: true,
            desc: 'Name of section folder.'
        });
    },
    prompting: {
        logIntro: function() {
            this.log('─────────────────────');
            this.log('Creating New Section');
            this.log('─────────────────────');
        },
        querySectionFolderName: function() {
            if (!this['section-name']) {
                var done = this.async();
                this.prompt({
                    type: 'input',
                    name: 'sectionName',
                    message: 'Section Folder Name',
                    validate: this.validateParam,
                    default: this.getExampleName()
                }, function(answers) {
                    this.settings.sectionName = answers.sectionName;
                    done();
                }.bind(this));
            } else {
                this.settings.sectionName = this['section-name'];
            }
        },
        composeSectionDirectory: function() {
            this.settings.sectionDirectory = Path.join(this.destinationPath(this.options.course), this.options.module, this.settings.sectionName);
            this.settings.sectionMetadataFilePath = Path.join(this.settings.sectionDirectory, this.settings.sectionMetadataFile);
        },
        logPromptResults: function() {
            var table = new Table();
            table.push({
                'Section Name': this.settings.sectionName
            });
            this.log(table.toString());
        },
        compose: function() {
            this.composeWith('edx:unit', {
                options: {
                    'course': this.options.course,
                    'module': this.options.module,
                    'section': this.settings.sectionName,
                    'unit-title': 'First Unit'
                }
            });
        }
    },
    writing: {
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.sectionMetadataFile),
                this.destinationPath(this.settings.sectionMetadataFilePath), {
                    sectionName: this.settings.sectionName
                }
            );
        }
    }
});