var generators = require('yeoman-generator');
var Path = require('path');
var Guid = require('node-uuid');
var Table = require('cli-table');


var edXBase = generators.Base.extend({
    settings: {
        unitContentFile: 'unit.md'
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
        this.option('section', {
            type: String,
            required: true,
            desc: 'Selects an existing section.',
            hide: true
        });
        this.option('unit-title', {
            type: String,
            required: true,
            optional: false,
            desc: 'Title of unit.'
        });
    },
    prompting: {
        logIntro: function() {
            this.log('─────────────────────');
            this.log('Creating New Unit');
            this.log('─────────────────────');
        },
        queryUnitTitle: function() {
            this.settings.unitTitle = this.options['unit-title'];
        },
        composeUnitDirectory: function() {
            this.settings.unitDirectory = Path.join(this.destinationPath(this.options.course), this.options.module, this.options.section);
            this.settings.unitContentFilePath = Path.join(this.settings.unitDirectory, (this.settings.unitTitle.toLowerCase().replace(' ', '_') + '.md'));
        },
        logPromptResults: function() {
            var table = new Table();
            table.push({
                'Unit Title': this.settings.unitTitle
            });
            this.log(table.toString());
        }
    },
    writing: {
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.unitContentFile),
                this.destinationPath(this.settings.unitContentFilePath), {
                    unitName: this.settings.unitName
                }
            );
        }
    }
});