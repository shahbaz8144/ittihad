import { Component, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from 'src/app/_models/user-dto';
import { InboxService } from 'src/app/_service/inbox.service';
import {
  PDFDocumentProxy, PDFProgressData
} from 'ng2-pdf-viewer/src/app/pdf-viewer/pdf-viewer.module';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { NewMemoService } from 'src/app/_service/new-memo.service';
import { MemoDetailsComponent } from '../memo-details/memo-details.component';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import tippy from 'node_modules/tippy.js';
@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css']
})
export class FileviewComponent implements OnInit {
  //url:string;
  public pdfSrc = "";
  contenttype: string;
  src: string;
  viewer: string;
  filename: string;
  HistorySearch: string
  private currentUserSubject: BehaviorSubject<UserDTO>;
  public currentUser: Observable<UserDTO>;

  error: any;
  page = 1;
  rotation = 0;
  zoom = 0.5;
  zoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;
  pdfQuery = '';
  mobile = false;
  DocumentSource: number;
  MailDocId: number = 0;
  _mailid: number;
  _ReplyId: number;
  _AnnouncementDocId: number;
  createdBy: number;
  _obj: InboxDTO;
  _LoginUserId: number;
  IsCommunicarionMemoDownload: boolean = false;
  _IsConfidential: string = 'false';
  _attachmentLst: [];
  progress: number = 0;
  ShowProgress: boolean = false;
  currentLang: "ar" | "en" = "ar";
  _NoIsCommunicarionMemoDownloadUser: boolean = false;
  NextUrl: string
  PreviousUrl: string
  NextUrlfn: string
  PreviousUrlfn: string
  NextMailDocId: number
  PreviousMailDocId: number
  _AttachmentUrls: any
  _CurrentpageNo: number = 1;
  _TotalRecords: number
  constructor(private route: ActivatedRoute, private inboxService: InboxService
    , public newmemoService: NewMemoService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router
  ) {
    this._LoginUserId = this.currentUserValue.createdby;
    this._obj = new InboxDTO();

    // this._MemoIds = JSON.parse(localStorage.getItem('MemoIds_' + this._mailid));





    console.log(this._CurrentpageNo, "_CurrentpageNo");
  }

  // @ViewChild(PdfViewerComponent)
  // private pdfComponent: PdfViewerComponent;
  public get currentUserValue(): UserDTO {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    return this.currentUserSubject.value[0];
  }

  url: string;
  _AttachmentCount: number;
  // _attachmentUrls: any;
  ngOnInit(): void {
    const lang: any = localStorage.getItem('language');
    this.translate.use(lang);
    this.currentLang = lang ? lang : 'en';
    this.document.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    if (lang == 'ar') {
      this.renderer.addClass(document.body, 'kt-body-arabic');
    } else if (lang == 'en') {
      this.renderer.removeClass(document.body, 'kt-body-arabic');
    }
    localStorage.setItem('language', lang);
    if (this.currentLang === 'ar') {
      // alert(lang);
      const cssFilePath = 'assets/i18n/arabic.css';
      // Create a link element for the CSS file
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssFilePath;
      // Set an id attribute to identify the link element
      link.id = 'arabicCssLink';
      // Append the link element to the document head
      this.renderer.appendChild(document.head, link);
    } else if (this.currentLang === 'en') {
      // alert(lang);
      const linkElement = document.getElementById('arabicCssLink');
      if (linkElement && linkElement.parentNode) {
        console.log('Removing Arabic styles');
        this.renderer.removeChild(document.head, linkElement);
      } else {
        console.log('Link element not found or already removed');
      }
    }

    this.IsCommunicarionMemoDownload = this.currentUserValue.IsCommunicationDownload;
    // alert(this.IsCommunicarionMemoDownload);
    if (this.currentUserValue.RoleId == 502) {
      this.IsCommunicarionMemoDownload = true;
    }

    var decoder = new TextDecoder();
    //let surl = this.route.snapshot.params['url'];
    this.route.queryParams.subscribe(params => {
      
      let surl = params['url'];
      // alert(surl)
      const arr = surl.split(',').map(element => {
        return Number(element);
      });
      this.src = decoder.decode(new Uint8Array(arr));
      // alert(this.src);
      let uid = params['uid'];
      const arruid = uid.split(',').map(element => {
        return Number(element);
      });
      if (decoder.decode(new Uint8Array(arruid)).toString() != this.currentUserValue.createdby.toString()) {
        alert('Invalid User');
        return false;
      }
      let type = params['type'];
      this.DocumentSource = type;
      // alert(this.DocumentSource);

      let Maildocid = params['MailDocId'];
      if (Maildocid == undefined) Maildocid = 0
      this.MailDocId = Maildocid;
      //  alert(this.MailDocId);

      let MailId = params['MailId'];
      this._mailid = MailId;

      let ReplyId = params['ReplyId'];
      this._ReplyId = ReplyId;


      let AnnouncementDocId = params['AnnouncementDocId'];
      this._AnnouncementDocId = AnnouncementDocId;

      let loginuserid = params['LoginUserId'];
      this.createdBy = loginuserid;

      let isconfidential = params['IsConfidential'];
      this._IsConfidential = isconfidential;
      if (this.IsCommunicarionMemoDownload === false && this._IsConfidential === 'true') {
        this._NoIsCommunicarionMemoDownloadUser = true;  // Hide all buttons
      } else if (this.IsCommunicarionMemoDownload === true && this._IsConfidential === 'true') {
        this._NoIsCommunicarionMemoDownloadUser = false; // Hide History and Download, show ConfidentialMemo
        this.IsCommunicarionMemoDownload = false;
      } else {
        this._NoIsCommunicarionMemoDownloadUser = false; // Show History and Download buttons
      }

      this._AttachmentUrls = JSON.parse(localStorage.getItem('AttachmentMemoId_' + this._mailid) ?? '[]');
      this._TotalRecords = this._AttachmentUrls.length;
      // alert(this._TotalRecords)
      if (this._AttachmentUrls != null) {
        var l = this._TotalRecords;
        // this._TotalRecords = l;
        this._AttachmentUrls[-1] = this._AttachmentUrls[l - 1]; // this is legal
        this._AttachmentUrls[l] = this._AttachmentUrls[0];
        var current = "";
        for (var i = 0; i < l; i++) {
          current = this._AttachmentUrls[i].url;
          if (current == this.src) {
            this._CurrentpageNo = i + 1;
            this.PreviousUrl = this._AttachmentUrls[i - 1].url;
            this.NextUrl = this._AttachmentUrls[i + 1].url;

            this.PreviousUrlfn = this._AttachmentUrls[i - 1].FileName;
            this.NextUrlfn = this._AttachmentUrls[i + 1].FileName;

            this.PreviousMailDocId = this._AttachmentUrls[i - 1].MailDocId;
            this.NextMailDocId = this._AttachmentUrls[i + 1].MailDocId;
          }
        }
        // restore the this._AttachmentUrls
        this._AttachmentUrls.pop();
        this._AttachmentUrls[-1] = null;
      }
      else {
        this._CurrentpageNo = 1;
        this.PreviousUrl = "";
        this.NextUrl = "";
        this.PreviousMailDocId = 0;
        this.NextMailDocId = 0;
      }

      // alert(this.IsCommunicarionMemoDownload);
      // alert(this._NoIsCommunicarionMemoDownloadUser);
      let scontenttype = '';
     debugger
      this.filename = params['filename'];
      const arrfilename = this.filename.split(',').map(element => {
        return Number(element);
      });
      this.filename = decoder.decode(new Uint8Array(arrfilename));
      // console.log(this.filename,"streambox");
      this.filename = this.filename.replace(/%26/g, "&");
      // console.log(this.filename, "Sending Path");
      // alert(this.filename)

     
      this.inboxService.PathExtention(this.src).subscribe(
        da => {
          
          console.log(da, "Pdf Data")
          scontenttype = da["contentType"];
          let contenttype = scontenttype;//decoder.decode(new Uint8Array(arrct));
          console.log(contenttype, "File type");
          let officetext = ".ppt, .pptx, .doc, .docx, .xls, .xlsx";
          let office = officetext.includes(contenttype.toLowerCase());

          let googletext = ".txt,.css, .html, .php, .c, .cpp, .h, .hpp, .js, .pages, .ai, .psd, .tiff, .dxf, .svg, .eps, .ps, .ttf, .xps, .zip,";
          let google = googletext.includes(contenttype.toLowerCase());

          let pdftext = ".pdf, .application/pdf"
          let pdf = pdftext.includes(contenttype.toLocaleLowerCase());

          let Imagetext = ".jpg, .jpeg, .webp, .avif, .jfif, .svg, .ico, .gif .image/jpg, .image/png, .png"
          let Image = Imagetext.includes(contenttype.toLocaleLowerCase());

          // let Audiotext = ".mp3, .wav, .ogg"
          // let Audio = Audiotext.includes(contenttype.toLocaleLowerCase());

          // let Videotext = ".mp4, .mov, .wmv, .avi, .webm"
          // let Video = Videotext.includes(contenttype.toLocaleLowerCase());

          if (office) {
            this.viewer = "office";
          }
          else if (google) {
            this.viewer = "google";
          }
          else if (pdf) {
            this.viewer = "pdf";
            this.ShowProgress = true;
            // this.progress=75;
          }
          else if (Image) {
            this.viewer = "image";
          }
          // else if (Audio) {
          //   this.viewer = "Audio";
          // }
          // else if (Video) {
          //   this.viewer = "Video";
          // }
          else {
            this.viewer = "";
          }
        });
      if (this.MailDocId != 0) {
        // alert(this.MailDocId);
        this.inboxService.AttachmentData(this.MailDocId)
          .subscribe(data => {
            // console.log(data, "Attachmemtdata");
            this._obj = data as InboxDTO;
            this._attachmentLst = data["Data"]["AttachmentData"];
            // this._attachmentLst = JSON.parse(this._obj.AttachmentData);
            // this._attachmentLst = Attachmentpreview;
            // console.log(Attachmentpreview,"Name");
            // if (this._obj.AttachmentData) {
            //   this._attachmentLst = JSON.parse(this._obj.AttachmentData);
            // } else {
            //   this._attachmentLst = []; // or handle it as needed
            // }

          });
      }
      // alert(this.IsCommunicarionMemoDownload);
    });



    const savedCount = localStorage.getItem('attachmentCount'); // Retrieve the value as a string
    if (savedCount !== null) { // Check if the saved count is not null
      this._AttachmentCount = JSON.parse(savedCount); // Parse the string back to a number
    } else {
      this._AttachmentCount = 0; // Set a default value or handle the case where it doesn't exist
    }

    // const savedUrls = localStorage.getItem('attachmentUrls');
    // if (savedUrls) {
    //   this._attachmentUrls = JSON.parse(savedUrls);
    //   console.log('Retrieved Attachment URLs:', this._attachmentUrls);
    //   // You can now use the retrieved URLs as needed
    // } else {

    // }

  }
  LoadDocument(url1: string, filename: string, MailDocId: number) {
     
    let name = "Memo/ArchiveView";
    var rurl = document.baseURI + name;
    var encoder = new TextEncoder();
    let url = encoder.encode(url1);
  
    let encodeduserid = encoder.encode(this.currentUserValue.createdby.toString());
    filename = filename.replace(/%/g, "%25")
                       .replace(/#/g, "%23")
                       .replace(/&/g, "%26");
  
    var myurl = `${rurl}/url?url=${url}&uid=${encodeduserid}&filename=${encoder.encode(filename)}&type=1&MailDocId=${MailDocId}&MailId=${this._mailid}&ReplyId=${this._ReplyId}&LoginUserId=${this._LoginUserId}&IsConfidential=${this._IsConfidential}&AnnouncementDocId=0`;
    
    // Open the URL in the same window
    window.location.href = myurl;
  }
  

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeTippy()
    }, 0);
  }

  initializeTippy() {
    const hoverElementsPF = document.querySelectorAll('.Tipply_History');
    hoverElementsPF.forEach(hoverElementINMPF => {
      tippy(hoverElementINMPF, {
        content: 'History',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    const hoverElementsD = document.querySelectorAll('.Tipply_Download');
    hoverElementsD.forEach(hoverElementINMPFD => {
      tippy(hoverElementINMPFD, {
        content: 'Download',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });
    const hoverElementsRP = document.querySelectorAll('.Records_per_page');
    hoverElementsRP.forEach(hoverElementINMPFDRP => {
      tippy(hoverElementINMPFDRP, {
        content: 'Records per page',
        placement: 'left',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    const hoverElementsN = document.querySelectorAll('.Tipply_Previous');
    hoverElementsN.forEach(hoverElementINMPFDRPN => {
      tippy(hoverElementINMPFDRPN, {
        content: 'Previous',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

    const hoverElementsP = document.querySelectorAll('.Tipply_Next');
    hoverElementsP.forEach(hoverElementINMPFDRPN => {
      tippy(hoverElementINMPFDRPN, {
        content: 'Next',
        placement: 'bottom',
        arrow: true,
        animation: 'scale-extreme',
        animateFill: true,
        inertia: true,
      });
    });

  }
  Redirectiontomemodetails(name, id, ReplyId) {

    // let name = "Memo/Details";
    // var rurl = document.baseURI + name;
    // var myurl = rurl +  "/"+ this._mailid;
    // var myWindow = window.open(myurl);
    // myWindow.focus();

    var url = document.baseURI + name;
    var myurl = `${url}/${id}/${ReplyId}`;
    //var myurl = `${url}`;
    //this.router.navigate([myurl]);
    var myWindow = window.open(myurl, id, ReplyId);
    //var myWindow = window.open(myurl);
    myWindow.focus();

    localStorage.setItem('MailId', id);

    // this.router.navigateByUrl(myurl).then(e => {
    //   if (e) {
    //     window.open(myurl, '_blank').focus()
    //     console.log("Navigation is successful!");
    //   } else {
    //     console.log("Navigation has failed!");
    //   }
    // });

  }
  incrementZoom(amount: number) {
    this.zoom += amount;
  }
  incrementPage(amount: number) {
    this.page += amount;
  }

  /**
  * Get pdf information after it's loaded
  * @param pdf pdf document proxy
  */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
    // $("body").removeClass("progressattachment");
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  rotate(angle: number) {
    this.rotation += angle;
  }
  /**
   * Pdf loading progress callback
   * @param progressData pdf progress data
   */

  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
    this.progress = Math.round(progressData.loaded / progressData.total * 100);
    if (this.progress == 100) this.ShowProgress = false;
    // console.log(`Uploaded! ${this.progress}%`);
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination pdf navigate to
   */
  // navigateTo(destination: any) {
  //   this.pdfComponent.pdfLinkService.goToDestination(destination);
  // }

  /**
   * Scroll view
   */
  // scrollToPage() {
  //   this.pdfComponent.pdfViewer.scrollPageIntoView({
  //     pageNumber: 3
  //   });
  // }
  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param e custom event
   */
  pageRendered(e: CustomEvent) {
    // console.log('(page-rendered)', e);
  }

  /**
   * Page initialized callback.
   *
   * @param {CustomEvent} e
   */
  pageInitialized(e: CustomEvent) {
    // console.log('(page-initialized)', e);
  }

  // searchQueryChanged(newQuery: string) {
  //   if (newQuery !== this.pdfQuery) {
  //     this.pdfQuery = newQuery;
  //     this.pdfComponent.pdfFindController.executeCommand('find', {
  //       query: this.pdfQuery,
  //       highlightAll: true
  //     });
  //   } else {
  //     this.pdfComponent.pdfFindController.executeCommand('findagain', {
  //       query: this.pdfQuery,
  //       highlightAll: true
  //     });
  //   }
  // }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    if (event.target.innerWidth <= 768)
      this.mobile = true;
    else
      this.mobile = false;
  }

  download(url, filename) {
    
    if (this.DocumentSource == 1) {
      this._obj.MailId = this._mailid;
      this._obj.MailDocId = this.MailDocId;
      this._obj.CreatedBy = this._LoginUserId;
      this._obj.AnnouncementDocId = this._AnnouncementDocId;
      this.newmemoService.DownloadAttachment(this._obj).subscribe(
        data => {
          this._obj = data as InboxDTO;
          fetch(url).then(function (t) {
            return t.blob().then((b) => {
              var a = document.createElement("a");
              a.href = URL.createObjectURL(b);
              a.setAttribute("download", filename);
              a.click();
            }
            );
          });

        })
    } else if (this.DocumentSource == 2) {
      fetch(url).then(function (t) {
        return t.blob().then((b) => {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.setAttribute("download", filename);
          a.click();
        }
        );
      });
    }

  }
  HistoryList: any;
  DownloadHistory() {
    // alert(this.MailDocId);
    this._obj.MailDocId = this.MailDocId;
    this._obj.OrganizationId = this._LoginUserId;
    this._obj.AnnouncementDocId = this._AnnouncementDocId;

    this._obj.MailId = this._mailid;
    this.newmemoService.HistoryDownload(this._obj).subscribe(
      data => {
        this._obj = data as InboxDTO;
        this.HistoryList = JSON.parse(this._obj.RequestJson);
        this.HistoryList.forEach(element => {
          element.DatesJson = JSON.parse(element.DatesJson);
        });
      })
    this.HistorySearch = "";
  }
  searchhistory() {
    this.HistorySearch = "";
  }
}


