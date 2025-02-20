export class AddUsers {
    MailId: number
    ReplyId:number
    message:string
    CreatedBy: number
    ToUserAry: string
    CCUserAry: string
    ToUserxml: string
    CCUserxml: string
    Type:boolean
    IsToUsers:boolean
    ReplyIds:string
    OrganizationId:number
}

export class CustomUsersDTO
{
  DisplayName: string
  CreatedBy: number
  disabled:boolean
  Type:number
  IsExist:boolean
  UserActiveStatus:boolean
}

export class EPProjectsDTO
{
  Project_Code:string
  Project_Name:string
  Proj_Resp:string
  TwoLetters:string
  ProjectInfo:any[]
  SubtaskDetails_Json:any[]
  Difference_In_Days:number
  DeadLine:Date
}