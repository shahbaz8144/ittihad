import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InboxDTO } from 'src/app/_models/inboxdto';
import { InboxService } from 'src/app/_service/inbox.service';
import { UserDTO } from 'src/app/_models/user-dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {
  _obj1: InboxDTO;
  currentUserSubject: BehaviorSubject<UserDTO>;
  currentUser: any;
  _LstToUsers: any;
  ObjgetCompanyList: any;
  Adduserserach: string = "";
  Workflowname: string = "";
  SelectUserErrlog: boolean = false;
  SelectedUsers: any[] = [];
  ReplyRequired_Value: boolean = false;
  ApprovalPending_Value: boolean = false;
  User_Note: string = "";
  EmployeeId: number;
  selectedOption: string = '';
  AttReqselectedOption: boolean;
  Workflowdetails: any;
  WorkFlowName: string = '';
  _ActionType: string = '';
  _CreatedDate: string = '';
  WorkflowLeftsectionlist: any;
  workflowId: number;
  selectedWorkflowId: number;
  Stepnamevalues: string;
  // Array to store values from dynamic textboxes
  dynamicValues: number[] = [];
  // Array to store indexes of duplicate values
  duplicateIndexes: number[] = [];
  constructor(private inboxService: InboxService, private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {
    this.currentUserSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this._obj1 = new InboxDTO();
    this.ObjgetCompanyList = [];
    this.EmployeeId = parseInt(this.currentUserValue.EmployeeCode);
  }
  public get currentUserValue(): UserDTO {
    return this.currentUserSubject.value[0];
  }

  ngOnInit(): void {
    // this.GetWorkFlowDetails();
    this.WorkflowLeftsectionList();
    this.toggleDocumentLocation('2');

  }
  WorkflowLeftsectionList() {
    this.inboxService.GetWorkFlowMasterAPI(this.EmployeeId, this.currentUserValue.organizationid)
      .subscribe(data => {
        console.log(data, "get workflow details");
        this.WorkflowLeftsectionlist = data["Data"]["WorkFlowJson"];
        if (this.WorkflowLeftsectionlist.length > 0) {
          this.selectedWorkflowId = this.WorkflowLeftsectionlist[0].WorkFlowId;
          this.WorkFlowDetails(this.selectedWorkflowId); // Set the first workflow as selected
        }
        console.log(this.WorkflowLeftsectionlist, "Left section list");
      })
  }
  WorkFlowDetails(WorkFlowId: number) {
    this.selectedWorkflowId = WorkFlowId;
    this._obj1.WorkFlowId = WorkFlowId;
    this.inboxService.GetWorkFlowDetailsAPI(this._obj1)
      .subscribe(data => {
        console.log(data, "get workflow details");
        this.Workflowdetails = data["Data"]["WorkFlowDetails"];
        this.Workflowdetails = this.Workflowdetails.sort((a, b) => a.SortId - b.SortId);
        this.WorkFlowName = this.Workflowdetails[0].WorkFlowName;
        this._ActionType = this.Workflowdetails[0].ActionType;
        this._CreatedDate = this.Workflowdetails[0].CreatedDate;
        console.log(this.Workflowdetails, "Selected workflow data");
        $('kt-nav__link').addClass('active');
      })
  }
  // Check if both Approved and Rejected exist with 'Next step'
  hasApprovedAndRejectedNextStep(actions: any[]): boolean {
    const hasApproved = actions.some(a => a.UserAction === 'Approved' && a.SystemAction === 'Next step');
    const hasRejected = actions.some(a => a.UserAction === 'Rejected' && a.SystemAction === 'Next step');
    return hasApproved && hasRejected;
  }

  // Function to validate duplicate values
  validateDuplicates(): void {
    const duplicates: number[] = [];
    const valueCounts: { [key: string]: number } = {};

    // Count occurrences of each value
    this.dynamicValues.forEach((value, i) => {
      if (!value) return; // Ignore empty values
      valueCounts[value] = (valueCounts[value] || 0) + 1;
      if (valueCounts[value] > 1) {
        duplicates.push(i);
      }
    });

    // Update duplicateIndexes array
    this.duplicateIndexes = duplicates;
  }

  toggleDocumentLocation(option: string) {
    this.selectedOption = option;
    interface UserActionDetails {
      UserAction: string;
      SystemAction: string;
      UserId: number;
    }

    let UsersActions: UserActionDetails[] = []; // Typed UsersActions array

    if (this.selectedOption === '2') {
      // Get the last user ID
      const lastUserId = this.SelectedUsers[this.SelectedUsers.length - 1]?.UserId;

      this.SelectedUsers.forEach(user => {

        // Assign default values for Approved and Rejected actions
        user.SystemActionApproved = user.SystemActionApproved || 'Next step';
        user.SystemActionReject = user.UserId === lastUserId
          ? user.SystemActionReject || 'Close'
          : user.SystemActionReject || 'Next step';
      });

    } else if (this.selectedOption === '1') {


      // Get the last user ID from the selected users
      const lastUserId = this.SelectedUsers[this.SelectedUsers.length - 1]?.UserId;
      console.log("Last User ID:", lastUserId);
      this.SelectedUsers.forEach(user => {
        // Assign default values for Approved and Rejected actions
        user.SystemActionReplied = user.UserId === lastUserId
          ? user.SystemActionReplied || 'Close'
          : user.SystemActionReplied || 'Next step';
      });
    }
  }

  AttachmentRequired(AttReqopt: boolean) {
    this.AttReqselectedOption = AttReqopt;
  }
  workflow_create() {
    this.ObjgetCompanyList = [];
    this._obj1.CreatedBy = this.currentUserValue.createdby;
    this._obj1.organizationid = this.currentUserValue.organizationid;
    this._obj1.DocumentId = 0;
    this.inboxService.ShareUserList(this._obj1)
      .subscribe(data => {
        console.log(data, "add Users");
        this._LstToUsers = data["Data"].UserJson;
        console.log(this._LstToUsers, "User List Data");
        this._LstToUsers.forEach(element => {
          if (!this.ObjgetCompanyList.some(user => user.UserId === element.UserId)) {
            this.ObjgetCompanyList.push({
              EmployeeId: element.EmployeeId,
              ContactName: element.ContactName,
              disabled: false,
              sortId: 0,
              Stepname: '',
              AttachmentRequired: false
            });
          }
        });

      });
    document.getElementById("workflow-list").style.display = "none";
    document.getElementById("workflow-create").style.display = "block";
  }
  workflow_list() {
    this.ClearWorkflowdata();
    document.getElementById("workflow-list").style.display = "block";
    document.getElementById("workflow-create").style.display = "none";
  }

  open_workflow_user_modal() {
    document.getElementById("workflow-user-modal-backdrop").style.display = "block";
    document.getElementById("workflow-user-modal").style.display = "block";
  }

  // updateSelectedValues(EmployeeId: number, event: any) {
  //   const isChecked = event.checked;

  //   // Update Check status for all instances of the same UserId
  //   this.ObjgetCompanyList.forEach(element => {
  //     if (element.EmployeeId === EmployeeId) {
  //       element.Check = isChecked;
  //     }
  //   });
  //   console.log(this.ObjgetCompanyList, "User list selected");
  // }
  updateSelectedValues(EmployeeId: number, event: any) {
    const isChecked = event.checked;

    // Update Check status for all instances of the same UserId
    this.ObjgetCompanyList.forEach(element => {
      if (element.EmployeeId === EmployeeId) {
        element.Check = isChecked;
      }
    });

    // Assign sortId if checked, or clear sortId if unchecked
    if (isChecked) {
      // Assign sortId for the newly selected item
      const currentSortIds = this.ObjgetCompanyList
        .filter(user => user.sortId !== null)
        .map(user => user.sortId);

      const nextSortId = currentSortIds.length > 0 ? Math.max(...currentSortIds) + 1 : 1;

      this.ObjgetCompanyList.forEach(user => {
        if (user.EmployeeId === EmployeeId) {
          user.sortId = nextSortId;
          user.Stepname = 'Step-' + nextSortId;
        }
      });
    } else {
      // Clear sortId for the deselected item
      this.ObjgetCompanyList.forEach(user => {
        if (user.EmployeeId === EmployeeId) {
          user.sortId = null;
          user.Stepname =null;
        }
      });

      // Resequence sortIds for remaining selected users
      let sortCounter = 1;
      this.ObjgetCompanyList
        .filter(user => user.Check) // Only process selected users
        .forEach(user => {
          user.sortId = sortCounter++;
        });
    }

    console.log(this.ObjgetCompanyList, 'Updated User List with Sort IDs');
  }

  AddSelectUser() {
    this.dynamicValues = [];
    this.duplicateIndexes = [];
    this.SelectedUsers = [];
    // Filter out duplicates based on UserId
    const uniqueUserIds = new Set();
    this.SelectedUsers = this.ObjgetCompanyList.filter(element => {
      if (element.Check && !uniqueUserIds.has(element.EmployeeId)) {
        uniqueUserIds.add(element.EmployeeId);
        return true;
      }
      return false;
    });

    if (!this.SelectedUsers || this.SelectedUsers.length === 0) {
      console.error('SelectedUsers is not initialized properly!');
      return;
    }

    interface UserActionDetails {
      UserAction: string;
      SystemAction: string;
      UserId: number;
    }

    let UsersActions: UserActionDetails[] = []; // Typed UsersActions array

    if (this.selectedOption === '2') {
      // Get the last user ID
      const lastUserId = this.SelectedUsers[this.SelectedUsers.length - 1]?.EmployeeId;

      this.SelectedUsers.forEach(user => {

        // Assign default values for Approved and Rejected actions
        // user.SystemActionApproved = user.SystemActionApproved || 'Next step';
        user.SystemActionApproved = user.SystemActionApproved || (user.sortId === this.SelectedUsers.length ? 'Close' : 'Next step');

        user.SystemActionReject = user.sortId === this.SelectedUsers.length
          ? user.SystemActionReject || 'Close'
          : user.SystemActionReject || 'Next step';
      });

    } else if (this.selectedOption === '1') {


      // Get the last user ID from the selected users
      // const lastUserId = this.SelectedUsers[this.SelectedUsers.length - 1]?.EmployeeId;
      // console.log("Last User ID:", lastUserId);
      this.SelectedUsers.forEach(user => {
        // Assign default values for Approved and Rejected actions
        user.SystemActionReplied = user.sortId === this.SelectedUsers.length
          ? user.SystemActionReplied || 'Close'
          : user.SystemActionReplied || 'Next step';
      });
    }

    this.AddUserRequired = false;

    // Assuming `this.SelectedUsers` is an array
    this.dynamicValues.push(...Array.from({ length: this.SelectedUsers.length }, (_, i) => i + 1));
    // Sort the SelectedUsers array by sortId in ascending order
    this.SelectedUsers = this.SelectedUsers.sort((a, b) => (a.sortId || 0) - (b.sortId || 0));

    console.log("SELECTED USERS", this.SelectedUsers);
    this.AttachmentRequired(false)
    document.getElementById("workflow-user-modal-backdrop").style.display = "none";
    document.getElementById("workflow-user-modal").style.display = "none";
  }
  getLastSortId(): number {
    // Find the highest sortId in the SelectedUsers array
    const sortIds = this.SelectedUsers.map(user => user.sortId);
    return Math.max(...sortIds);
  }
  close_workflow_user_modal() {
    this.ObjgetCompanyList.forEach(element => {
      element.Check = false;
      element.SortId = "";
    });
    document.getElementById("workflow-user-modal-backdrop").style.display = "none";
    document.getElementById("workflow-user-modal").style.display = "none";
  }
  UserListJson: any;
  UserActions: any;
  UserActionsJson: any;
  SystemActionApproved_Value: any;
  SystemActionReject_Value: any;
  SystemActionReplied_Values: any;
  WorkflowNameRequired: boolean = false;
  allValidationsPassed: boolean = true;
  AddUserRequired: boolean = false;
  _UserActions: any;
  SystemDropApproved(event: any, user: any) {
    console.log('Approved action selected:', user.SystemActionApproved);
    // Any additional logic
  }

  SystemDropRejected(event: any, user: any) {
    console.log('Rejected action selected:', user.SystemActionReject);
    // Any additional logic
  }

  SystemDropReplied(user) {
    console.log(user);
  }

  Workflowsubmit() {
    this.WorkflowNameRequired = false;
    this.AddUserRequired = false;
    this.allValidationsPassed = true;

    // Validate Workflow Name
    if (!this.Workflowname) {
      this.WorkflowNameRequired = true;
      this.allValidationsPassed = false;
    }

    // Validate Selected Users
    if (this.SelectedUsers.length === 0) {
      this.AddUserRequired = true;
      this.allValidationsPassed = false;
    }

    if (!this.allValidationsPassed) {
      console.error("Validation failed: Please check required fields.");
      return;
    }

    const userJson = this.SelectedUsers.map((user, index) => {

      return ({

        EmployeeId: user.EmployeeId,
        SortId: $('#txt_' + user.EmployeeId).val(),
        StepName: user.Stepname,
        AttachmentRequired: user.AttachmentRequired,
      })
    });

    this.UserListJson = JSON.stringify(userJson, null); // Convert the array to JSON
    console.log("User List:", this.UserListJson);

    interface UserActionDetails {
      UserAction: string;
      SystemAction: string;
      EmployeeId: number; // Ensure this matches the interface
    }

    let UsersActions: UserActionDetails[] = [];

    // Handle different selectedOption values
    const lastEmployeeId = this.SelectedUsers[this.SelectedUsers.length - 1]?.EmployeeId;

    if (this.selectedOption === '2') {
      UsersActions = this.SelectedUsers.map(user => {
        const isLastUser = user.EmployeeId === lastEmployeeId;
        return [
          {
            UserAction: "Approved",
            SystemAction: user.SystemActionApproved || "Next step",
            EmployeeId: user.EmployeeId // Use EmployeeId here
          },
          {
            UserAction: "Rejected",
            SystemAction: isLastUser ? (user.SystemActionReject || "Close") : user.SystemActionReject,
            EmployeeId: user.EmployeeId // Use EmployeeId here
          }
        ];
      }).flat();
    } else if (this.selectedOption === '1') {
      UsersActions = this.SelectedUsers.map(user => {
        const isLastUser = user.EmployeeId === lastEmployeeId;
        return [
          {
            UserAction: "Replied",
            SystemAction: isLastUser ? (user.SystemActionReplied || "Close") : user.SystemActionReplied,
            EmployeeId: user.EmployeeId // Use EmployeeId here
          }
        ];
      }).flat();
    } else {
      console.error("Invalid selectedOption value:", this.selectedOption);
      return;
    }
    // Convert UsersActions to JSON
    this._UserActions = JSON.stringify(UsersActions, null, 2);
    console.log("User Actions:", this._UserActions);
    // Log Workflow details
    console.log("Workflow Name:", this.Workflowname);
    console.log("Action Type:", this.selectedOption);
    console.log("Attachment Required:", this.AttReqselectedOption);
    console.log("Note:", this.User_Note);

    this._obj1.WorkflowName = this.Workflowname;
    // this._obj1.AttachmentRequired = this.AttReqselectedOption;
    this._obj1.ActionType = this.selectedOption;
    this._obj1.Note = this.User_Note;
    this._obj1.CreatedByEmployeeId = this.EmployeeId;
    this._obj1.UserListJson = this.UserListJson;
    this._obj1.UserActions = this._UserActions;

    // API Call
    this.inboxService.InserWorkflowAPI(this._obj1)
      .subscribe(
        data => {
          this._snackBar.open('Add Workflow Successfully', 'End now', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.WorkflowLeftsectionList();
          this.ClearWorkflowdata();
          document.getElementById("workflow-list").style.display = "block";
          document.getElementById("workflow-create").style.display = "none";
          console.log("Workflow submitted successfully:", data);
        },
        error => {
          console.error("Error while submitting workflow:", error);
        }
      );
  }

  ClearWorkflowdata() {
    this.allValidationsPassed = true;
    this.WorkflowNameRequired = false;
    this.AddUserRequired = false;
    this.Workflowname = "";
    this.AttReqselectedOption = false;
    this.selectedOption = '2';
    this.User_Note = "";
    this.SelectedUsers = [];
    this.ObjgetCompanyList.forEach(element => {
      element.Check = false;
      element.sortId = "";
      element.SystemActionApproved = "";
      element.SystemActionReject = "";
      element.SystemActionReplied = "";
    });
  }
}
