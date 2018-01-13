export default function define(Blocks: Blockly.BlockDefinitions) {
  
  
  Blocks['musicimport'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('import music')
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
      this.setTooltip('Import Music');
      this.setHelpUrl('');
    },
  };
  
  
  Blocks['musicplay'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('music.play(')
        .appendField(new Blockly.FieldTextInput(''), 'musicplay')
        .appendField(')');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
      this.setTooltip('Play Music');
      this.setHelpUrl('');
    },
  };

  Blocks['musicpitch'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('music.pitch(')
        .appendField(new Blockly.FieldTextInput(''), 'musicpitch')
        .appendField(')');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
      this.setTooltip('Change music pitch');
      this.setHelpUrl('');
    },
  };

  Blocks['musicreset'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("music.reset()");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
   this.setTooltip("Reset Music");
   this.setHelpUrl("");
    }
  };

  Blocks['musicstop'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("music.stop()");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
   this.setTooltip("Stop Music");
   this.setHelpUrl("");
    }
  };

  Blocks['musictempo'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('music.set_tempo(')
        .appendField(new Blockly.FieldTextInput(''), 'musictempo')
        .appendField(')');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(48);
      this.setTooltip('Change music tempo');
      this.setHelpUrl('');
    },
  };

  Blocks['musicgettempo'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('music.get_tempo()');
      this.setInputsInline(false);
      this.setOutput(true, null);
      this.setColour(48);
      this.setTooltip('Get tempo');
      this.setHelpUrl('');
    },
  };

}