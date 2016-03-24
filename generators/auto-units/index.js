var generators = require('yeoman-generator');
var Path = require('path');

module.exports = generators.Base.extend({
    settings: {
        unitContentFile: "unit.md"
    },
    constructor: function() {
        generators.Base.apply(this, arguments);
        this.option('configuration', {
           type: Object,
           required: true 
        });
        this.configuration = this.options['configuration'];
    },
    writing: {
        writeFolder: function() {    
            for(var i = 0; i < this.configuration.modules.length; i++) {      
                for(var j = 0; j < this.configuration.modules[i].sections.length; j++) {
                    for(var k = 0; k < this.configuration.modules[i].sections[j].units.length; k++) {
                        var moduleFolderName = (i + 1).paddedString(2) + '_' + this.configuration.modules[i].name;
                        var sectionFolderName = (j + 1).paddedString(2) + '_' + this.configuration.modules[i].sections[j].name;
                        var unitFileName = (k + 1).paddedString(2) + '_' + this.configuration.modules[i].sections[j].units[k].name + '.md';
                        var unitMetadataFilePath = Path.join(this.destinationPath(this.configuration.name), moduleFolderName, sectionFolderName, unitFileName);
                        this.fs.copyTpl(
                            this.templatePath(this.settings.unitContentFile),
                            this.destinationPath(unitMetadataFilePath), {
                                unitTitle: this.configuration.modules[i].sections[j].units[k]
                            }
                        );
                    }
                }
            }
        }
    }
});