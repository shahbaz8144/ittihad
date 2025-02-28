import { Component, OnInit } from '@angular/core';
import { GACFileService } from 'src/app/_service/gacfile.service';
import { GACFiledto } from 'src/app/_models/gacfiledto';
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  TemplateList:any[]=[];
  TemplateSearch:string = "";
  obj:GACFiledto;
  constructor(private service:GACFileService) {
    this.obj = new GACFiledto();
   }

  ngOnInit(): void {
    this.TemplatesList();
  }


  TemplatesList(){
    this.service.GetTemplatesAPI().subscribe(data => {
      this.TemplateList = data['Data'].TemplateJson;
      console.log(this.TemplateList , "TemplatesList");
    })
      }

  template_open(TemplateId) {
    this.obj.TemplateId = TemplateId;
    this.service.GetTemplateByIdAPI(this.obj).subscribe(data =>{
 console.log(data, "Templates Id Data");
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
}
