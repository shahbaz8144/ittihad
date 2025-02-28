import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GACFileService } from '../../_service/gacfile.service';
import { GACFiledto } from '../../_models/gacfiledto';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import * as moment from 'moment-hijri';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit,AfterViewInit {
  @ViewChild('workspaceContainer') workspaceContainer!: ElementRef;
  TemplateList: any[] = [];
  TemplateSearch: string = "";
  obj: GACFiledto;
  workspaceData: any;
  position = { x: 0, y: 0 };
  workspaceWidth = 0;
  workspaceHeight = 0;
  workspaceBgColor = "";
  workspaceBorderColor = "";
  workspaceBorderWidth = 0;
  workspaceBorderRadius = 0;
  data = {
    code: "ABC123_22557788_2025_01",
    type: "Invoice",
    date: "",
    hj_date: "",
    barcode: "1234567890"
  };
  constructor(private service: GACFileService) {
    this.obj = new GACFiledto();
  }

  ngOnInit(): void {
    this.TemplatesList();
  }
    ngAfterViewInit(): void {
     
    }

  getFirstLine(text: string): string {
    return text.substring(0, Math.ceil(text.length / 2));
  }

  getSecondLine(text: string): string {
    return text.substring(Math.ceil(text.length / 2));
  }

  TemplatesList() {
    this.service.GetTemplatesAPI().subscribe(data => {
      this.TemplateList = data['Data'].TemplateJson;
      console.log(this.TemplateList, "TemplatesList");
    })
  }
  renderAllBarcodes() {
    this.workspaceData.elements.forEach((element, index) => {
      if (element.type === 'barcode') {
        this.renderBarcode(index);
      }
    });
  }
   renderBarcode(index: number) {
      setTimeout(() => {
        const barcodeCanvas = document.getElementById(`barcode-${index}`) as HTMLCanvasElement;
        if (barcodeCanvas) {
          const element = this.workspaceData.elements[index];
       
          JsBarcode(barcodeCanvas, "1234567890123", {
            format: 'CODE128',
            displayValue: false,
            lineColor: "#000",
            background: "#fff",
            width: 2,
            height: 50
          });
        }
      }, 100);
    }
    SelectedTemplateId:number
  template_open(TemplateId) {
    this.obj.TemplateId = TemplateId;
    this.SelectedTemplateId = TemplateId;
    this.service.GetTemplateByIdAPI(this.obj).subscribe(data => {
      // Extract the TemplateData string
       
      const templateDataString = data['Data'].TemplateDetailsJson[0].TemplateData;
      this.position.x = data['Data'].TemplateDetailsJson[0].PositionX;
      this.position.y = data['Data'].TemplateDetailsJson[0].PositionY;
      // Parse the string to convert it into an object
      const templateData = JSON.parse(templateDataString);

      // Now, you can access width and height
      
      this.workspaceWidth = templateData.width;
      this.workspaceHeight = templateData.height;
      this.workspaceBgColor = templateData.backgroundColor;
      this.workspaceBorderColor = templateData.borderColor;
      this.workspaceBorderWidth = templateData.borderWidth;
      this.workspaceBorderRadius = templateData.borderRadius;
 
      this.workspaceData = templateData;
      console.log(this.workspaceData, "workspaceData");
      this.renderAllBarcodes();

    });
    document.getElementById("template_preview").classList.add("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.add("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.add("d-block");
  }
  template_close() {
    document.getElementById("template_preview").classList.remove("kt-quick-panel--on");
    document.getElementsByClassName("side_view")[0].classList.remove("position-fixed");
    document.getElementsByClassName("kt-aside-menu-overlay")[0].classList.remove("d-block");
  }
  onDragEnd(event: CdkDragEnd) {
    this.position = event.source.getFreeDragPosition();
    this.position.x = event.source.getFreeDragPosition().x;
    this.position.y = event.source.getFreeDragPosition().y;
  }
   getIslamicDate(): string {
      return moment().format('iYYYY/iMM/iDD'); // Example: 1445/07/15
    }
    isTextTooLong(text: string, width: number): boolean {
      const approxCharWidth = 6; // Adjust based on font size
      return text.length * approxCharWidth > width;
    }
    // Function to bind values dynamically
    bindValue(element: any): string {
      if (element.type === 'barcode') {
        return this.data.barcode; // Bind barcodeNumber
      } else if (element.type === 'systemDefined') {
        const match = element.text.match(/{{(.*?)}}/);
        if (match) {
          const key = match[1];
          if (key === 'hj_date') {
            return this.getIslamicDate(); // Get today's Hijri date
          }
          else if (key === 'date') {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            return formattedDate; // Get today's Hijri date
          }
          return this.data[key] || 'N/A'; // Fetch corresponding value
        }
      }
      return '';
    }

    UpdatePosition(Xvalue:any,Yvalue:any){
      this.obj.TemplateId = this.SelectedTemplateId;
      this.obj.PositionX = Xvalue;
      this.obj.PositionY = Yvalue;
      this.service.NewAddTemplatePositionsAPI(this.obj).subscribe(data => {
        console.log(data);
      })
    }
}
