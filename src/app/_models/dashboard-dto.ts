export class DashboardDto {
  UserId: number
  DashboardJson: string
  CountsJSON: string
  ExpiredMemos: number
  PendingFromOthersCount:number;
  NewMemos: number
  ReplyRequiredMemos: number
  ApprovalMemos: number
  TotalApprovalMemos: number
  ActionTaken: number
  Pending: number
  ActionMemoPercentage: number
  TotalGeneralMemos: number
  ActionTakenGeneral: number
  PendingGeneral: number
  GeneralMemoPercentage: number
  BarJson: string
  TotalPercentage: number
  FullName: string
  SuggestionJson:string
  BannerJson:string
  CreatedBy: number
  PageSize: number;
  PageNumber: number;
  MemosJSON: string;
  TotalRecordsJSON: string;
  MailId: number;
  GacChartJson: string;
  Search:string
}
