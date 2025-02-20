import { Plugin } from '@ckeditor/ckeditor5-core';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

const signatures = [
  { id: 1, text: 'Best regards, John Doe' },
  { id: 2, text: 'Sincerely, Jane Smith' },
  // Add more signatures as needed
];

export class SignaturePlugin extends Plugin {
  init() {
    
    const editor = this.editor;

    editor.ui.componentFactory.add('signature', locale => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert Signature',
        icon: '/path/to/icon.svg',
        tooltip: true,
      });

      // Dropdown or modal logic to select a signature goes here

      view.on('execute', () => {
        // Example logic to get selected signature
        // This should be replaced with actual logic to show a selection UI and get the user's choice
        const signature = signatures[0]; // Placeholder for actual selection logic

        editor.model.change(writer => {
          const insertPosition = writer.createPositionAt(editor.model.document.getRoot()!, 'end');
          writer.insertText(signature.text, insertPosition);
        });
      });

      return view;
    });
  }
}

