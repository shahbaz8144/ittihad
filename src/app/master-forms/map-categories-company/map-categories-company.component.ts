import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MapCategoriesCompanyDTO } from 'src/app/_models/map-categories-company-dto';
import { SubcategoriesDTO } from 'src/app/_models/subcategories-dto';
import { UserDTO } from 'src/app/_models/user-dto';
import { UserRegistrationDTO } from 'src/app/_models/user-registration-dto';
import { MapCategoriesCompanyService } from 'src/app/_service/map-categories-company.service';
import { SubcategoriesService } from 'src/app/_service/subcategories.service';
import { UserRegistrationService } from 'src/app/_service/user-registration.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import tippy from 'tippy.js';
import {FlatTreeControl} from '@angular/cdk/tree';
import {ChangeDetectionStrategy, } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
declare var $: any;
interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-map-categories-company',
  templateUrl: './map-categories-company.component.html',
  styleUrls: ['./map-categories-company.component.css']
})
export class MapCategoriesCompanyComponent implements OnInit {


  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  objValues_DTO: SubcategoriesDTO;
  _obj: MapCategoriesCompanyDTO;
  JsonString_List: string;
  Xml_List: string;
  ObjList: any;
  _CategoryLst: any;
  _mappedCategorieslst: any;
  selectedCompanyValue: number
  panelOpenState = false;
  SelectItems: string[];
  CategoryListFromService: [];
  objcompanyList: any;
  Data: string;
  CompanyId: number;
  _objII: UserRegistrationDTO;
  selectedItemList1 = [];
  selectedItem_List2 = [];
  checkedIDs = [];
  _LstCategory: SubcategoriesDTO[];
  _LstChildSubCategory: SubcategoriesDTO[];
  _LstSubCategory: SubcategoriesDTO[];
  _UnLstCategory: MapCategoriesCompanyDTO[];
  _UnLstChildSubCategory: MapCategoriesCompanyDTO[];
  _UnLstSubCategory: MapCategoriesCompanyDTO[];
_createdby:number;
SelectedCompanyId:number;
_SubCategoryId:number;
  master_checked: boolean = false;
  master_indeterminate: boolean = false;
  loadAPI: Promise<any>;
  currentLang:"ar"|"en"="ar";
  SelectCompany:string;
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  constructor(public service: MapCategoriesCompanyService, 
    public services: UserRegistrationService,
     public subCategoryService: SubcategoriesService,
     private renderer: Renderer2,
     private translate:TranslateService,
         @Inject(DOCUMENT) private document: Document,
    ) {
    this.objValues_DTO = new SubcategoriesDTO();
    this._objII = new UserRegistrationDTO(); 
this._createdby = this.currentUserValue.createdby;
    this.selectedCompanyValue = 0;

    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });
    HeaderComponent.languageChanged.subscribe((lang)=>{
      localStorage.setItem('language',lang);
      this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.SelectCompany = lang === 'en' ? 'Select Company' : 'اختر الشركة';
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Search Company For Mapping';
    } else if (lang === 'ar') {
      tooltipContent = 'البحث عن الشركة للتعيين';
    }

    if(lang == 'ar'){
      this.renderer.addClass(document.body, 'kt-body-arabic');
    }else if (lang == 'en'){
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#SearchCompanyForMapping', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
    })
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  filterItemsOfType(type) {
    // console.log(type);
    return this._LstChildSubCategory.filter(x => x.SubId == type);
  }
  filterItemsOfSubCategory(CategoryId) {

    return this._LstChildSubCategory.filter(element => element.IsUnderSubCategory == false
      && element.SubId == 0
      && element.CategoryId == CategoryId)

  }

  // UNmapped Categories

  UnfilterItemsOfType(type) {
    return this._UnLstChildSubCategory.filter(x => x.SubId == type);
  }
  SelectedCategoryId:number;
  UnfilterItemsOfSubCategory(CategoryId) {
   this.SelectedCategoryId = CategoryId;
  //  alert(this.SelectedCategoryId);
    return this._UnLstChildSubCategory.filter(element => element.IsUnderSubCategory == false
      && element.SubId == 0
      && element.CategoryId == CategoryId);
  }

  ngOnInit() {
    let lang: any = localStorage.getItem('language');
    this.translate.use(lang);
      this.currentLang = lang ? lang : 'en';
      this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      if(lang == 'ar'){
        this.renderer.addClass(document.body, 'kt-body-arabic');
      }else if (lang == 'en'){
        this.renderer.removeClass(document.body, 'kt-body-arabic');
      }
    this.getCompany();
    //this.LoadSubCategories();
    let tooltipContent = '';
    if (lang === 'en') {
      tooltipContent = 'Search Company For Mapping';
    } else if (lang === 'ar') {
      tooltipContent = 'البحث عن الشركة للتعيين';
    }

    // Initialize Tippy.js with the appropriate tooltip content
    tippy('#SearchCompanyForMapping', {
      content: tooltipContent,
      arrow: true,
      animation: 'scale-extreme',
      animateFill: true,
      inertia: true
    });
  }
  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script")
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = ["assets/js/mapcaegorycompanytreeview.js"];

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement('script');
        node.src = dynamicScripts[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }

    }
  }

  getCompany() {
    this._objII.CreatedBy = this.currentUserValue.createdby;
    this._objII.OrganizationId = this.currentUserValue.organizationid;
    this.services.GetCompanyList(this._objII)
      .subscribe(data => {
        this.objValues_DTO = data as SubcategoriesDTO;
        this.objcompanyList = this.objValues_DTO.Data["CompanyList"]
      })
  }
  LoadSubCategories() {
    this.objValues_DTO.CreatedBy = this.currentUserValue.createdby;
    this.objValues_DTO.OrganizationId = this.currentUserValue.organizationid;
    this.objValues_DTO.RoleId = this.currentUserValue.RoleId;
    this.subCategoryService.LoadSubCategoryDetails(this.objValues_DTO).subscribe(
      data => {
        this.objValues_DTO = data as SubcategoriesDTO;
        this._LstCategory = JSON.parse(this.objValues_DTO.CategoryJson);
        console.log(this._LstCategory,"Cat list")
        this._LstChildSubCategory = JSON.parse(this.objValues_DTO.SubCategoryJson);
        this._LstSubCategory = [];
        this.loadAPI = new Promise((resolve) => {
          this.loadScript();
          resolve(true);
        });
      })
  }

  mappedCatogries(CompanyId) {
this.SelectedCompanyId = CompanyId;
    this.service.GetCategoriesByCompanyId(CompanyId).subscribe(
      data => {
        this._obj = data as MapCategoriesCompanyDTO;
        this._UnLstCategory = JSON.parse(this._obj.CategoryJson);
        this._UnLstChildSubCategory = JSON.parse(this._obj.SubCategoryJson);
        this._LstSubCategory = [];
        this.LoadSubCategories();

        // this.loadAPI = new Promise((resolve) => {
        //   this.loadScript();
        //   resolve(true);
        // });
      })
  }


 

  fetchCheckedIds() {
    this.checkedIDs = [];
    this._UnLstChildSubCategory.forEach((value, index) => {
      if (value.SubCategoryId) {
        this.checkedIDs.push(value.SubCategoryId);
      }
      // if (value.SubId) {
      //   this.checkedIDs.push(value.SubId);
      // }
    });
  }

  // Category
  bindblock(val) {
    $('.blocksdiv').css('display', 'none');
    // this.LoadSubCategories();
    var _value = (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("warehousehdn_" + val)).value = "0";
    }
    $('#blockdiv_' + val).toggle();
  }

  bindRacks(val) {
    this._SubCategoryId = val;
    // debugger 
    // alert(12334)
    $('.racksdiv').css('display', 'none');
    var _value = (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("blockshdn_" + val)).value = "0";
    }
    $('#rackdiv_' + val).toggle();
  }
  
  // bindshelves(val: number, element: HTMLInputElement | null) {
  //   console.log(val, "Id");
  //   this._SubCategoryId = val;
  
  //   $('.shelvediv').css('display', 'none');
  
  //   if (element) {
  //     const _value = element.value;
  //     element.value = _value === "0" ? "1" : "0";
  //   } else {
  //     console.warn(`Element not passed correctly for ID: rackshdn_${val}`);
  //   }
  
  //   $(`#shelvesdiv_${val}`).toggle();
  // }
  
  
  bindshelves(val) {
    this._SubCategoryId = val;
    // $('.shelvediv').css('display', 'none');
    // var _value = (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value;
    // if (_value == "0") {
    //   (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "1";
    // } else {
    //   (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "0";
    // }
    // $('#shelvesdiv_' + val).toggle();
  }
  // bindshelvesD(val){
  //   $('.shelvediv').css('display', 'none');
  //   var _value = (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value;
  //   if (_value == "0") {
  //     (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "1";
  //   } else {
  //     (<HTMLInputElement>document.getElementById("rackshdn_" + val)).value = "0";
  //   }
  //   $('#shelvesdiv_' + val).toggle();
  // }



  // Mapped Categories 
  bindblock1(val) {
    $('.blocksdiv1').css('display', 'none');
    var _value = (<HTMLInputElement>document.getElementById("1warehousehdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("1warehousehdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("1warehousehdn_" + val)).value = "0";
    }
    $('#1blockdiv_' + val).toggle();
  }
  bindRacks1(val) {
    $('.racksdiv1').css('display', 'none');
    var _value = (<HTMLInputElement>document.getElementById("1blockshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("1blockshdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("1blockshdn_" + val)).value = "0";
    }
    $('#1rackdiv_' + val).toggle();
  }
  bindshelves1(val) {
    $('.shelvediv1').css('display', 'none');
    var _value = (<HTMLInputElement>document.getElementById("1rackshdn_" + val)).value;
    if (_value == "0") {
      (<HTMLInputElement>document.getElementById("1rackshdn_" + val)).value = "1";
    } else {
      (<HTMLInputElement>document.getElementById("1rackshdn_" + val)).value = "0";
    }
    $('#shelvesdiv_' + val).toggle();
  }

  //Button Mapping 
  Mapping_changeSelection() {

    this.selectedItemList1 = this._LstCategory.filter((value, index) => {
      return value.checked == true;
    })
  }
  //Button UnMapping 
  UnMapping_changeSelection() {
    this.selectedItem_List2 = this._UnLstCategory.filter((value, index) => {
      return value.checked == true;
    })
  }

//   CategoryJson: any[] = []; // Properly initialize as an empty array

// MappingCategory() {
//   if (!this.CategoryJson) {
//     this.CategoryJson = [];
//   }

//   // Push the new object to the array
//   this.CategoryJson.push({
//     SubCategoryId: this._SubCategoryId,
//     CompanyId: this.SelectedCompanyId,
//     CreatedBy: this._createdby,
//   });

//   // Print JSON in the desired order
//   const orderedJson = this.CategoryJson.map((item) => ({
//     SubCategoryId: item.SubCategoryId,
//     CompanyId: item.CompanyId,
//     CreatedBy: item.CreatedBy,
//   }));

//   console.log(JSON.stringify(orderedJson, null, 2)); // Pretty print JSON
// }

CategoryJson: any[] = []; // Stores the final JSON of checked items
CheckedValues: Set<number> = new Set(); // Keeps track of checked values

// Method to handle checkbox change
updateCheckedValues(event: Event, subCategory: any) {
  const checkbox = event.target as HTMLInputElement;

  if (checkbox.checked) {
    // Add the SubCategoryId to the set of checked values
    this.CheckedValues.add(subCategory.SubCategoryId);
  } else {
    // Remove the SubCategoryId from the set if unchecked
    this.CheckedValues.delete(subCategory.SubCategoryId);
  }
}

// Method to generate the JSON when the button is clicked
MappingCategory() {
  // Generate the JSON dynamically using the checked values
  this.CategoryJson = Array.from(this.CheckedValues).map((id) => ({
    SubCategoryId: id,
    CompanyId: this.SelectedCompanyId,
    CreatedBy: this._createdby,
  }));

  console.log('CategoryJson:', JSON.stringify(this.CategoryJson, null, 2));
}


toggle_subcategory(subcategoryId: number) {
  // Select the icon using the data-subcategory attribute
  const icon = this.document.querySelector(`.mapping-drop-group-label-icon[data-subcategory="${subcategoryId}"]`);

  if (icon) {
      // Toggle the `aria-expanded` attribute
      const isExpanded = icon.getAttribute('aria-expanded') === 'true';
      icon.setAttribute('aria-expanded', (!isExpanded).toString());
  }

  // Toggle the corresponding subcategory's visibility
  const subcategoryElement = this.document.getElementById(`subcategory-show${subcategoryId}`);
  if (subcategoryElement) {
      subcategoryElement.classList.toggle("show");
  }
}


}

