var generators = require('yeoman-generator');
var Path = require('path');
var Table = require('cli-table');


var edXBase = generators.Base.extend({
    settings: {
        courseMetadataFile: 'course.json'
    },
    validateParam: function(input) {
        if (input && input.length > 0) {
            return true;
        } else {
            return 'You must enter a value.';
        }
    }
});

module.exports = edXBase.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.argument('course-name', {
            type: String,
            required: false,
            optional: true,
            desc: 'Name of course to create.'
        });
    },
    prompting: {
        logIntro: function () {            
            this.log('─────────────────────');
            this.log('Creating New Course');
            this.log('─────────────────────');
        },
        queryCourseName: function() {
            if (!this['course-name']) {
                var done = this.async();
                this.prompt({
                    type: 'input',
                    name: 'courseName',
                    message: 'Name of Course',
                    validate: this.validateParam
                }, function(answers) {
                    this.settings.courseName = answers.courseName;
                    done();
                }.bind(this));
            } else {
                this.settings.courseName = this['course-name'];
            }
        },
        composeCourseDirectory: function() {
            this.settings.courseDirectory = this.destinationPath(this.settings.courseName);
            this.settings.courseMetadataFilePath = Path.join(this.settings.courseDirectory, this.settings.courseMetadataFile);
        },
        logPromptResults: function() {
            var table = new Table();
            table.push({
                'Course Name': this.settings.courseName
            }, {
                'Course Directory': this.settings.courseDirectory
            });
            this.log(table.toString());
        },
        compose: function () {
            this.composeWith('edx:module', {
                options: {
                    'course': this.settings.courseName,
                    'module-title': 'Intro Module'
                },
                args: [
                    'Mod00'
                ]
            });
        }
    },
    writing: {
        writeFolder: function() {
            this.fs.copyTpl(
                this.templatePath(this.settings.courseMetadataFile),
                this.destinationPath(this.settings.courseMetadataFilePath), {
                    courseName: this.settings.courseName
                }
            );
        }
    }
});