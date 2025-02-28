import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ResizeEvent } from 'angular-resizable-element';
import { HttpClient } from '@angular/common/http';
import * as JsBarcode from 'jsbarcode';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
interface ElementData {
  id?: number;
  type: string;
  text?: string;
  staticText?: string;
  placeholder?: string;
  renderedText?: string;
  fileUrl?: string;
  barcodeNumber?: string;
  rows?: number;
  cols?: number;
  tableData?: string[][];
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: string;
  valueType?: 'userDefined' | 'systemDefined';
}

@Component({
  selector: 'app-custom-template',
  templateUrl: './custom-template.component.html',
  styleUrls: ['./custom-template.component.css']
})
export class CustomTemplateComponent implements AfterViewInit {

  @ViewChild('workspaceContainer') workspaceRef!: ElementRef;
  elements: ElementData[] = [];
  elementIdCounter = 1;
  copiedElement: ElementData | null = null;
  selectedElement: ElementData | null = null;
  selectedElementIndex: number | null = null;
  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  contextMenuTarget: 'workspace' | 'element' = 'workspace';
  editLabelIndex: number | null = null;
  editLabelStaticText: string = '';
  editLabelHasPlaceholder: boolean = false;
  showPropertiesPanel = false;
  workspaceWidth = 400;
  workspaceHeight = 300;
  workspaceBgColor = '#ffffff';
  workspaceBorderColor = '#dedede';
  workspaceBorderWidth = 1;
  workspaceBorderRadius = 10;
  prevWorkspaceWidth: number = this.workspaceWidth;
  prevWorkspaceHeight: number = this.workspaceHeight;
  apiUrl = 'http://localhost:3000/api/elements';
  // Label dialog controls
  showLabelDialog: boolean = false;
  newLabelStaticText: string = '';
  newLabelHasPlaceholder: boolean = false;
  newLabelPlaceholderKey: string = '';
  templateName: string = '';
  workspace = {
    width: 800,             //  Default workspace width
    height: 600,            //  Default workspace height
    backgroundColor: "#ffffff", //  Default white background
    borderColor: "#dedede", //  Default black border
    borderWidth: 1,         //  Border thickness
    borderRadius: 10        //  Rounded corners
  };
  systemDefinedValues = ['{{code}}', '{{type}}', '{{date}}', '{{hj_date}}'];
  fontSize: number = 10.6;
  obj:GACFiledto;
  TextValues:string;
  constructor(private http: HttpClient,private service:GACFileService) {
    this.obj = new GACFiledto();
  }

 
  ngAfterViewInit() {
    if (this.workspaceRef) {
      this.workspaceWidth = this.workspaceRef.nativeElement.clientWidth;
      this.workspaceHeight = this.workspaceRef.nativeElement.clientHeight;
    }
  }

  // Open Properties Panel
  openPropertiesPanel() {
    this.showPropertiesPanel = true;
    this.contextMenuVisible = false; // Hide context menu
  }

  // 🔹 Add System Defined Element
  addSystemDefinedElement(sysVal: string) {
    const fontSize = this.fontSize; // ✅ Default small size
    const width = this.calculateTextWidth(sysVal, fontSize); // Auto width
    const newElement: ElementData = {
      id: this.elementIdCounter++,
      type: 'systemDefined',
      text: sysVal, // Set system-defined value
      x: 50,
      y: 50,
      width: width,
      height: fontSize + 10,
      backgroundColor: '#ffffff',
      fontColor: '#000000',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: fontSize //  Default small font size
    };
    this.elements.push(newElement);
  }

  updateSelectedElement() {
    if (this.selectedElement) {
      const index = this.elements.findIndex(el => el.id === this.selectedElement!.id);
      if (index !== -1) {
        this.elements[index] = { ...this.selectedElement }; //  Create a new reference to trigger change detection

        // Update width/height if font size changes
        this.updateFontSize();

        //  Manually call `onResize()` when updating from the panel
        this.onResize({
          rectangle: {
            width: this.selectedElement!.width,
            height: this.selectedElement!.height
          }
        } as ResizeEvent, index);
      }
    }
  }


  // Close Properties Panel
  closePropertiesPanel() {
    this.showPropertiesPanel = false;
    this.selectedElement = null;
  }
  //  Method to update workspace styles dynamically
  updateWorkspaceStyles(width: number, height: number, bgColor: string, borderColor: string, borderWidth: number, borderRadius: number) {
    this.workspaceWidth = width;
    this.workspaceHeight = height;
    this.workspaceBgColor = bgColor;
    this.workspaceBorderColor = borderColor;
    this.workspaceBorderWidth = borderWidth;
    this.workspaceBorderRadius = borderRadius;
  }

  onWorkspaceResize(event: ResizeEvent) {
    if (event.rectangle.width && event.rectangle.height) {
      const newWidth = event.rectangle.width;
      const newHeight = event.rectangle.height;

      //  Calculate scaling factors
      const scaleX = newWidth / this.prevWorkspaceWidth;
      const scaleY = newHeight / this.prevWorkspaceHeight;

      //  Scale all elements proportionally
      this.elements.forEach(element => {
        element.x *= scaleX;
        element.y *= scaleY;
        element.width *= scaleX;
        element.height *= scaleY;
      });

      //  Update workspace size
      this.workspaceWidth = newWidth;
      this.workspaceHeight = newHeight;
      this.prevWorkspaceWidth = newWidth;
      this.prevWorkspaceHeight = newHeight;
    }
  }

  // ==============================
  // ELEMENT ADDITION & LABEL DIALOG
  // ==============================

  // Opens the modal dialog for label creation.
  openLabelDialog() {
    this.newLabelStaticText = '';
    this.newLabelHasPlaceholder = false;
    this.newLabelPlaceholderKey = '';
    this.showLabelDialog = true;
    this.editLabelIndex = null;
  }

  // Called from the dialog to add a new label element.
  addLabel() {

    if (!this.newLabelStaticText.trim()) {
      alert('Label name cannot be empty!');
      return;
    }

    const formattedPlaceholder = this.newLabelHasPlaceholder
      ? `{{${this.newLabelStaticText.replace(/\s+/g, '')}}}`
      : '';

    const fontSize = this.fontSize; // ✅ Small default font size
    const width = this.calculateTextWidth(this.newLabelStaticText, fontSize); // Auto width

    const newElement: ElementData = {
      id: this.elementIdCounter++, // Increment element ID
      type: 'label',
      staticText: this.newLabelStaticText,
      placeholder: formattedPlaceholder,
      renderedText: `${this.newLabelStaticText} ${formattedPlaceholder}`.trim(), // Shows placeholder
      x: 50,
      y: 50,
      width: width,
      height: fontSize + 10,
      backgroundColor: '#ffffff',
      fontColor: '#000000',  //  Default black text
      fontStyle: 'normal',   //  Default normal text
      fontWeight: 'normal',   //  Default normal weight
      fontSize: fontSize, //  Default font size
      // Default to User-Defined
      valueType: 'userDefined'
    };

    this.elements.push(newElement);
    this.showLabelDialog = false;
  }

  // Open Edit Modal for an Existing Label
  openEditLabelDialog(index: number) {
    const label = this.elements[index];
    this.editLabelIndex = index;
    this.editLabelStaticText = label.staticText!;
    this.editLabelHasPlaceholder = !!label.placeholder;
    this.showLabelDialog = true;
  }

  // Save Edited Label
  saveEditedLabel() {

    if (this.editLabelIndex !== null) {
      const formattedPlaceholder = this.editLabelHasPlaceholder
        ? `{{${this.editLabelStaticText.replace(/\s+/g, '')}}}`
        : '';

      this.elements[this.editLabelIndex] = {
        ...this.elements[this.editLabelIndex], // Keep existing properties
        staticText: this.editLabelStaticText,
        placeholder: formattedPlaceholder,
        renderedText: `${this.editLabelStaticText} ${formattedPlaceholder}`.trim()
      };

      this.editLabelIndex = null;
      this.showLabelDialog = false;
    }
  }
  // ==============================
  // GENERAL ELEMENT FUNCTIONS
  // ==============================

  // Existing addElement method for barcode, table, image etc.
  addElement(type: string) {
    const fontSize = this.fontSize; // ✅ Default small font size
    let width = 150;
    let height = fontSize + 10;
    if (type === 'table') {
      const rows = parseInt(prompt('Enter number of rows:', '3') || '3', 10);
      const cols = parseInt(prompt('Enter number of columns:', '3') || '3', 10);
      if (rows > 0 && cols > 0) {
        const newTable: ElementData = {
          id: this.elementIdCounter++, // Increment element ID
          type: 'table',
          rows,
          cols,
          tableData: Array.from({ length: rows }, () => Array(cols).fill('')),
          x: 50,
          y: 50,
          width: cols * 80,
          height: rows * 40,
          backgroundColor: '#ffffff',
          fontColor: '#000000',  //  Default black text
          fontStyle: 'normal',   //  Default normal text
          fontWeight: 'normal',   //  Default normal weight
          fontSize: fontSize, // ✅ Default small font size
          // Default to User-Defined
          valueType: 'userDefined'
        };
        this.elements.push(newTable);
      }
    } else {
      if (type === 'barcode') {
        width = 200;
        height = 50;
      }
      const newElement: ElementData = {
        id: this.elementIdCounter++, // Increment element ID
        type,
        staticText: type === 'label' ? 'Edit Me' : undefined,
        barcodeNumber: type === 'barcode' ? '{{barcode}}' : undefined,
        x: 50,
        y: 50,
        width: width,
        height: height,
        backgroundColor: '#ffffff',
        fontColor: '#000000',  //  Default black text
        fontStyle: 'normal',   //  Default normal text
        fontWeight: 'normal',   //  Default normal weight
        // Default to User-Defined
        valueType: 'userDefined',
        fontSize: fontSize
      };
      this.elements.push(newElement);
      if (type === 'barcode') {
        setTimeout(() => {
          // this.generateBarcode(newElement.barcodeNumber!, this.elements.length - 1);
          this.generateBarcode('1234567890', this.elements.length - 1); // Dummy Barcode
        }, 100);
      }
    }
  }
  calculateTextWidth(text: string, fontSize: number): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = `${fontSize}px Arial`; // Use Arial as default font
      return context.measureText(text).width + 10; // Add padding
    }
    return 100; // Default width if canvas fails
  }
  // Generate a random 10-digit barcode number.
  generateBarcodeNumber(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  // ==============================
  // COPY, PASTE, DELETE, CONTEXT MENU
  // ==============================

  copyElement() {
    if (this.selectedElementIndex !== null) {
      // ✅ Create a deep copy using JSON methods
      this.copiedElement = JSON.parse(JSON.stringify(this.elements[this.selectedElementIndex]));
      console.log('Copied Element:', this.copiedElement);
    }
    this.closeContextMenu();
  }


  pasteElement() {
    if (this.copiedElement) {
      // ✅ Deep copy again to avoid references
      const newElement = JSON.parse(JSON.stringify(this.copiedElement));

      // ✅ Assign a new ID to avoid conflicts
      newElement.id = this.elementIdCounter++;

      // ✅ Move the copied element slightly to avoid overlap
      newElement.x += 20;
      newElement.y += 20;

      this.elements.push(newElement);

      if (newElement.type === 'barcode') {
        setTimeout(() => {
          this.generateBarcode(newElement.barcodeNumber!, this.elements.length - 1);
        }, 100);
      }

      console.log('Pasted Element:', newElement);
    }
    this.closeContextMenu();
  }


  selectElement(index: number) {
    this.selectedElementIndex = index;
    console.log('Selected Element Index:', this.selectedElementIndex);
  }

  deleteSelectedElement() {
    if (this.selectedElementIndex !== null) {
      this.elements.splice(this.selectedElementIndex, 1);
      this.selectedElementIndex = null;
    }
    this.closeContextMenu();
  }

  openContextMenu(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation(); // Prevent workspace context menu
    this.selectedElementIndex = index;
    this.selectedElement = this.elements[index];
    this.contextMenuTarget = 'element';
    this.showContextMenu(event);
  }

  openWorkspaceContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.selectedElementIndex = null;
    this.contextMenuTarget = 'workspace';
    this.showContextMenu(event);
  }

  showContextMenu(event: MouseEvent) {
    this.contextMenuVisible = true;
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`
    };
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.contextMenuVisible) {
      this.closeContextMenu();
    }
  }

  clearAllElements() {
    this.elements = [];
    this.selectedElementIndex = null;
  }

  // ==============================
  // FILE UPLOAD & BARCODE GENERATION
  // ==============================

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.elements.push({
            id: this.elementIdCounter++, // Increment element ID
            type: 'image',
            fileUrl: reader.result as string,
            x: 50,
            y: 50,
            width: 75,
            height: 75,
            backgroundColor: '#ffffff',
            fontColor: '#000000',  //  Default black text
            fontStyle: 'normal',   //  Default normal text
            fontWeight: 'normal',   //  Default normal weight
            // Default to User-Defined
            valueType: 'userDefined'
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // generateBarcode(barcodeNumber: string, index: number) {

  //   setTimeout(() => {
  //     const barcodeCanvas = document.getElementById(`barcode-${index}`) as HTMLCanvasElement;
  //     if (barcodeCanvas) {
  //       const element = this.elements[index];
  //       const scaleFactor = 4;
  //       const barcodeWidth = Math.max(200, element.width * scaleFactor);
  //       const barcodeHeight = Math.max(60, (element.height - 30) * scaleFactor);

  //       const tempCanvas = document.createElement('canvas');
  //       tempCanvas.width = barcodeWidth;
  //       tempCanvas.height = barcodeHeight;

  //       JsBarcode(tempCanvas, barcodeNumber, {
  //         format: "CODE128",
  //         displayValue: false,
  //         width: Math.max(2, barcodeWidth / 400),
  //         height: barcodeHeight,
  //         margin: 10
  //       });

  //       const ctx = barcodeCanvas.getContext("2d");
  //       if (ctx) {
  //         ctx.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);
  //         barcodeCanvas.width = element.width;
  //         barcodeCanvas.height = element.height - 20;
  //         ctx.drawImage(tempCanvas, 0, 5, barcodeCanvas.width, barcodeCanvas.height - 10);
  //       }
  //     }
  //   }, 100);
  // }
  generateBarcode(barcodeNumber: string, index: number) {
    setTimeout(() => {
      const barcodeCanvas = document.getElementById(`barcode-${index}`) as HTMLCanvasElement;
      if (barcodeCanvas) {
        const element = this.elements[index];
        const ctx = barcodeCanvas.getContext('2d');

        // Ensure high DPI rendering
        const scaleFactor = window.devicePixelRatio || 1;
        barcodeCanvas.width = element.width * scaleFactor;
        barcodeCanvas.height = element.height * scaleFactor;
        ctx?.scale(scaleFactor, scaleFactor);

        JsBarcode(barcodeCanvas, barcodeNumber, {
          format: "CODE128",
          displayValue: false,
          width: Math.max(2, element.width / 150),
          height: element.height - 10,
          margin: 10
        });

        // Improve text clarity
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.font = `bold ${element.fontSize || 12}px Arial`;
          ctx.fillStyle = element.fontColor || "#000";
          ctx.textBaseline = "top";
        }
      }
    }, 100);
  }

  updateFontSize() {
    if (this.selectedElement) {
      const index = this.elements.findIndex(el => el.id === this.selectedElement!.id);
      if (index !== -1) {
        const fontSize = this.selectedElement.fontSize || 12;
        const newWidth = this.calculateTextWidth(this.selectedElement.staticText || '', fontSize);

        this.elements[index].width = newWidth;
        this.elements[index].height = fontSize + 10; // Adjust height
      }
    }
  }

  // ==============================
  // DRAGGING & RESIZING HANDLERS
  // ==============================

  onDragEnd(event: CdkDragEnd, index: number) {
    const position = event.source.getFreeDragPosition();
    const workspace = this.workspaceRef.nativeElement;
    const maxX = workspace.clientWidth - this.elements[index].width;
    const maxY = workspace.clientHeight - this.elements[index].height;
    this.elements[index].x = Math.max(0, Math.min(position.x, maxX));
    this.elements[index].y = Math.max(0, Math.min(position.y, maxY));
    console.log(`Element ${index} dragged to: X=${this.elements[index].x}, Y=${this.elements[index].y}`);
  }

  onResize(event: ResizeEvent, index: number) {

    // if (event.rectangle.width && event.rectangle.height) {
    this.elements[index].width = event.rectangle.width;
    this.elements[index].height = event.rectangle.height;

    if (this.elements[index].type === 'barcode') {
      this.generateBarcode(this.elements[index].barcodeNumber!, index);
    }

    if (this.elements[index].type === 'table' && this.elements[index].rows && this.elements[index].cols) {
      const rowHeight = this.elements[index].height / this.elements[index].rows;
      const colWidth = this.elements[index].width / this.elements[index].cols;
      const tableElement = document.getElementById(`table-${index}`) as HTMLTableElement;
      if (tableElement) {
        tableElement.style.width = `${this.elements[index].width}px`;
        tableElement.style.height = `${this.elements[index].height}px`;
      }
      console.log(`Table ${index} resized: Row Height=${rowHeight}, Col Width=${colWidth}`);
    }
    console.log(`Element ${index} resized to: Width=${this.elements[index].width}, Height=${this.elements[index].height}`);
    console.log('New Element:', this.elements[index]);
    // }
  }

  // ==============================
  // TEMPLATE SAVING & APPLYING
  // ==============================

  // Save the current template (elements) to the backend.
  saveTemplate() {
    const workspaceData = {
      width: this.workspaceWidth,
      height: this.workspaceHeight,
      backgroundColor: this.workspaceBgColor,
      borderColor: this.workspaceBorderColor,
      borderWidth: this.workspaceBorderWidth,
      borderRadius: this.workspaceBorderRadius,
      elements: this.elements // Nested elements inside the workspace
    };

    console.log(this.elements , "Check the value");
    console.log("🚀 Parent JSON:", JSON.stringify(workspaceData));

    this.obj.TemplateData  = JSON.stringify(workspaceData);
    this.service.AddDynamicTemplateAPI(this.obj).subscribe(data =>{
     console.log(data ,"Save Temple Data");
     this.clearAllElements();
    })
    // this.http.post(this.apiUrl, this.elements).subscribe(response => {
    //   console.log('Elements saved!', response);
    // });
  }

 
  

}
