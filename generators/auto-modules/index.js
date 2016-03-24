var generators = require('yeoman-generator');
var Path = require('path');
var Mkdirp = require('mkdirp');

Number.prototype.paddedString = function(count) {
     var padding = '';
     for (var i = 0; i < count; i++) {
         padding += '0';
     }
     return (padding + this).slice(count * -1);
}

module.exports = generators.Base.extend({
    settings: {
        moduleMetadataFile: 'module.json',
        imagesPlaeholderFile: 'images/.ignore',
        filesPlaceholderFile: 'files/.ignore'
    },
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.option('configuration', {
           type: Object,
           required: true 
        });
        this.configuration = this.options['configuration'];
    },   
    prompting: {
        compose: function () {  
            this.composeWith('edx:auto-sections', {
                options: {
                    'configuration': this.configuration
                }
            });                   
        }
    },
    writing: {
        writeFolder: function() {            
            for(var i = 0; i < this.configuration.modules.length; i++) {
                var moduleFolderName = (i + 1).paddedString(2) + '_' + this.configuration.modules[i].name;
                var moduleMetadataFilePath = Path.join(this.destinationPath(this.configuration.name), moduleFolderName, this.settings.moduleMetadataFile);
                var moduleImagesPlaceholderFilePath = Path.join(this.destinationPath(this.configuration.name), moduleFolderName, this.settings.imagesPlaeholderFile);
                var moduleFilesPlaceholderFilePath = Path.join(this.destinationPath(this.configuration.name), moduleFolderName, this.settings.filesPlaceholderFile);
                this.fs.copyTpl(
                    this.templatePath(this.settings.moduleMetadataFile),
                    this.destinationPath(moduleMetadataFilePath), {
                        moduleName: this.configuration.modules[i].name,
                        moduleTitle: this.configuration.modules[i].title
                    }
                );
                this.fs.write(moduleImagesPlaceholderFilePath, '');
                this.fs.write(moduleFilesPlaceholderFilePath, '');
            }
        }
    }
});