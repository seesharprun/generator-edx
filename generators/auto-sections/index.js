var generators = require('yeoman-generator');
var Path = require('path');

module.exports = generators.Base.extend({
    settings: {
        sectionMetadataFile: "section.json"
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
            this.composeWith('edx:auto-units', {
                options: {
                    'configuration': this.configuration
                }
            });                   
        }
    },
    writing: {
        writeFolder: function() {    
            for(var i = 0; i < this.configuration.modules.length; i++) {      
                for(var j = 0; j < this.configuration.modules[i].sections.length; j++) {
                    var moduleFolderName = (i + 1).paddedString(2) + '_' + this.configuration.modules[i].name;
                    var sectionFolderName = (j + 1).paddedString(2) + '_' + this.configuration.modules[i].sections[j].name;
                    var sectionMetadataFilePath = Path.join(this.destinationPath(this.configuration.name), moduleFolderName, sectionFolderName, this.settings.sectionMetadataFile);
                    this.fs.copyTpl(
                        this.templatePath(this.settings.sectionMetadataFile),
                        this.destinationPath(sectionMetadataFilePath), {
                            sectionName: this.configuration.modules[i].sections[j].name,
                            sectionTitle: this.configuration.modules[i].sections[j].title
                        }
                    );
                }
            }
        }
    }
});